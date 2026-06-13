// prerender.mjs — gera um shell estático do app (via ReactDOMServer.renderToString)
// e o injeta no #root do index.html, entre os marcadores <!--PRERENDER-START/END-->.
// Em produção o app HIDRATA esse shell (hydrateRoot) em vez de reconstruí-lo, o que
// reduz muito o trabalho de main thread (TBT). Por isso o markup precisa ser o render
// INICIAL e compatível com hidratação: por isso renderToString (e não innerHTML do
// cliente, que não tem os marcadores de texto e causa mismatch). O snapshot reflete o
// estado inicial dos componentes (contadores em 0, countdown em 59:00, reveals sem `.in`).
//
// Uso (via prerender.ps1):  CHROME_PATH=... node scripts/prerender.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const dir = path.dirname(fileURLToPath(import.meta.url));
// index.html servido vive em public/ (output do CF Pages). O server-legacy fica na raiz
// (vendor/, build-only — nao servido).
const indexPath = path.join(dir, '..', 'public', 'index.html');
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('Defina CHROME_PATH com o caminho do Chrome/Edge.');

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  // Sinaliza ao app que ESTE é o passe de prerender → ele usa createRoot p/ gerar o
  // markup do zero (em produção o app usa hydrateRoot sobre este snapshot).
  await page.evaluateOnNewDocument(() => { window.__PRERENDER__ = true; });
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(pathToFileURL(indexPath).href, { waitUntil: 'load' });
  // Em __PRERENDER__ o app NÃO se monta sozinho — só expõe window.App. Esperamos isso.
  await page.waitForFunction(() => typeof window.App === 'function', { timeout: 15000 });

  // Gera o markup com ReactDOMServer.renderToString: produz HTML COMPATÍVEL com a
  // hidratação (insere os marcadores de texto entre nós de texto adjacentes — ex.
  // `{moeda} {preço}` — que o hydrateRoot espera). O innerHTML do cliente não os tem,
  // o que causava mismatch em todo texto com múltiplas expressões. renderToString só
  // faz o render INICIAL (sem efeitos): contadores em 0, countdown em 59:00, sem `.in`.
  await page.addScriptTag({ path: path.join(dir, '..', 'vendor', 'react-dom-server-legacy.browser.production.min.js') });
  const markup = await page.evaluate(() =>
    ReactDOMServer.renderToString(React.createElement(window.App)));

  let html = await readFile(indexPath, 'utf8');
  const re = /(<!--PRERENDER-START-->)[\s\S]*?(<!--PRERENDER-END-->)/;
  if (!re.test(html)) throw new Error('Marcadores <!--PRERENDER-START/END--> não encontrados em index.html');
  // Função de substituição (não string): o markup contém `$` (preços "R$16,50") e numa
  // string de replace o `$1`/`$2` seria interpretado como backreference, corrompendo o
  // snapshot. Com a função, o markup é inserido literalmente.
  html = html.replace(re, (_full, p1, p2) => p1 + markup + p2);
  await writeFile(indexPath, html, 'utf8');
  console.log(`Pré-render OK: ${(markup.length / 1024).toFixed(0)} KB injetados no #root`);
} finally {
  await browser.close();
}
