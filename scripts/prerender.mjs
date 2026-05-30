// prerender.mjs — gera um shell estático do app e injeta no #root do index.html.
// Carrega o index.html num Chrome headless, deixa o React renderizar, captura o
// HTML do #root e grava entre os marcadores <!--PRERENDER-START/END-->.
// Não há hidratação: em produção o createRoot substitui o #root inteiro ao montar,
// então o shell serve só para o first paint / LCP / SEO. Qualquer valor dinâmico
// no snapshot (countdown, contadores) é descartado quando o React assume.
//
// Uso (via prerender.ps1):  CHROME_PATH=... node scripts/prerender.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const dir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(dir, '..', 'index.html');
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('Defina CHROME_PATH com o caminho do Chrome/Edge.');

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(pathToFileURL(indexPath).href, { waitUntil: 'load' });
  await page.waitForSelector('#root .nav', { timeout: 15000 }); // espera o React montar
  await new Promise(r => setTimeout(r, 1200));                   // deixa os reveals acima da dobra rodarem
  const markup = await page.evaluate(() => document.getElementById('root').innerHTML);

  let html = await readFile(indexPath, 'utf8');
  const re = /(<!--PRERENDER-START-->)[\s\S]*?(<!--PRERENDER-END-->)/;
  if (!re.test(html)) throw new Error('Marcadores <!--PRERENDER-START/END--> não encontrados em index.html');
  html = html.replace(re, `$1${markup}$2`);
  await writeFile(indexPath, html, 'utf8');
  console.log(`Pré-render OK: ${(markup.length / 1024).toFixed(0)} KB injetados no #root`);
} finally {
  await browser.close();
}
