// critical-css.mjs — extrai o CSS "above-the-fold" do styles.css e o injeta inline
// no <style id="critical-css"> do index.html, entre os marcadores CRITICAL-CSS-START/END.
// O styles.css completo continua sendo carregado (de forma não-bloqueante) e reaplica tudo;
// o inline serve só para o primeiro paint não esperar o styles.css (melhora FCP/LCP).
//
// Como funciona: carrega o index.html num Chrome headless em DOIS viewports (mobile e
// desktop), força o styles.css a aplicar, e para cada regra decide se ela é crítica
// (algum elemento que o seletor casa está dentro da primeira dobra). Une os dois passes.
// @keyframes / @font-face são sempre mantidos. @media só entram se casarem no viewport.
//
// Uso (via critical-css.ps1):  CHROME_PATH=... node scripts/critical-css.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const dir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(dir, '..', 'index.html');
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('Defina CHROME_PATH com o caminho do Chrome/Edge.');

// Função executada DENTRO da página. Retorna { leaves, critical } onde leaves é a lista
// achatada de regras (mesma ordem/estrutura em qualquer viewport) e critical[i] diz se a
// regra i é crítica NESTE viewport.
function extractInPage() {
  // garante que o styles.css aplique mesmo que esteja como media="print"/preload
  for (const l of document.querySelectorAll('link')) {
    if (l.href && l.href.includes('styles.css')) { l.media = 'all'; if (l.rel === 'preload') l.rel = 'stylesheet'; }
  }
  document.body.getBoundingClientRect(); // força recálculo de layout

  const sheet = [...document.styleSheets].find(s => s.href && s.href.includes('styles.css'));
  if (!sheet) return { error: 'styles.css não encontrado', hrefs: [...document.styleSheets].map(s => s.href) };

  const vh = window.innerHeight;
  const TOP = vh * 1.15; // margem de segurança acima da dobra
  const isAbove = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return r.top < TOP && r.bottom > -1;
    // elemento sem caixa (provável display:none) — uma regra que ESCONDE algo acima da
    // dobra é crítica (senão pisca). Usa o ancestral visível mais próximo p/ decidir.
    let p = el.parentElement;
    while (p) {
      const pr = p.getBoundingClientRect();
      if (pr.width > 0 && pr.height > 0) return pr.top < TOP && pr.bottom > -1;
      p = p.parentElement;
    }
    return false;
  };
  const PE = /::?(?:before|after|placeholder|selection|first-line|first-letter|backdrop|marker|file-selector-button)\b/gi;
  const DYN = /:(?:hover|focus|focus-within|focus-visible|active|visited|target|checked|disabled|enabled|valid|invalid|required|optional|placeholder-shown|read-only|read-write|default|indeterminate|autofill)(?:\([^)]*\))?/gi;
  const sanitize = (s) => s.replace(PE, '').replace(DYN, '').trim();
  const selAbove = (selectorText) => {
    for (let part of selectorText.split(',')) {
      part = part.trim();
      if (part === '*' || /(^|[\s>+~])(?::root|html|body)\b/.test(part)) return true;
      const s = sanitize(part);
      if (!s) return true; // seletor era só pseudo → mantém (seguro)
      let els;
      try { els = document.querySelectorAll(s); } catch (e) { return true; } // não testável → mantém
      for (const el of els) if (isAbove(el)) return true;
    }
    return false;
  };

  const leaves = [];   // { type:'style'|'keep', media:string|null, cssText, sel? }
  const critical = [];
  const walk = (rules, media, mediaMatches) => {
    for (const rule of rules) {
      if (rule.type === 1) {                    // CSSStyleRule
        leaves.push({ type: 'style', media, cssText: rule.cssText });
        critical.push(mediaMatches && selAbove(rule.selectorText));
      } else if (rule.type === 4) {             // CSSMediaRule
        const m = window.matchMedia(rule.media.mediaText).matches;
        walk(rule.cssRules, rule.media.mediaText, mediaMatches && m);
      } else if (rule.type === 5 || rule.type === 7) { // @font-face | @keyframes
        leaves.push({ type: 'keep', media: null, cssText: rule.cssText });
        critical.push(true);
      } else if (rule.cssText) {                // @supports, @page, etc. — mantém inteiro
        leaves.push({ type: 'keep', media, cssText: rule.cssText });
        critical.push(true);
      }
    }
  };
  walk(sheet.cssRules, null, true);
  return { leaves, critical, vh };
}

async function pass(page, width, height, url) {
  await page.setViewport({ width, height });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('#root .nav', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1300)); // deixa os reveals acima da dobra entrarem
  const res = await page.evaluate(extractInPage);
  if (res.error) throw new Error(`${res.error} — sheets: ${JSON.stringify(res.hrefs)}`);
  return res;
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
try {
  // file:// bloqueia o acesso a cssRules (origem opaca) → servir por http (mesma origem)
  const url = process.env.BASE_URL || pathToFileURL(indexPath).href;
  const page = await browser.newPage();
  const mob = await pass(page, 390, 844, url);    // mobile
  const desk = await pass(page, 1280, 900, url);  // desktop

  if (mob.leaves.length !== desk.leaves.length)
    throw new Error(`estrutura divergente entre passes (${mob.leaves.length} vs ${desk.leaves.length})`);

  // união: regra é crítica se for crítica em QUALQUER viewport
  const leaves = mob.leaves;
  const keep = leaves.map((_, i) => mob.critical[i] || desk.critical[i]);

  // reconstrói em ordem, agrupando regras consecutivas sob o mesmo @media
  let css = '', curMedia = null;
  for (let i = 0; i < leaves.length; i++) {
    if (!keep[i]) continue;
    const l = leaves[i];
    if (l.media !== curMedia) {
      if (curMedia !== null) css += '}';
      if (l.media !== null) css += `@media ${l.media}{`;
      curMedia = l.media;
    }
    css += l.cssText;
  }
  if (curMedia !== null) css += '}';

  // injeta entre os marcadores
  let html = await readFile(indexPath, 'utf8');
  const re = /(\/\*CRITICAL-CSS-START\*\/)[\s\S]*?(\/\*CRITICAL-CSS-END\*\/)/;
  if (!re.test(html)) throw new Error('Marcadores CRITICAL-CSS-START/END não encontrados em index.html');
  html = html.replace(re, `$1${css}$2`);
  await writeFile(indexPath, html, 'utf8');

  const kept = keep.filter(Boolean).length;
  console.log(`Critical CSS OK: ${kept}/${leaves.length} regras | ${(css.length / 1024).toFixed(1)} KB inline`);
} finally {
  await browser.close();
}
