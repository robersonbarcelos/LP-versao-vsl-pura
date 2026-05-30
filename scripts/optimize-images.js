// optimize-images.js — redimensiona + converte para WebP as imagens em uso na LP.
// Uso: npx --yes --package=sharp@0.33.5 node scripts/optimize-images.js
// Mantém os originais (PNG/JPG) intactos; gera os .webp ao lado.
const path = require('path');
const sharp = require('sharp');

const IMG = path.join(__dirname, '..', 'img');

// { arquivo de origem, largura-alvo (px), qualidade }
const jobs = [
  { src: 'heeerochat01.png', width: 1000, q: 80 }, // hero / LCP
  { src: 'noise-tools.png',  width: 820,  q: 80 },
  { src: 'diego.png',        width: 640,  q: 82 },
  { src: 'aspira.png',       width: 400,  q: 80 },
  { src: 'clovis.png',       width: 400,  q: 80 },
  { src: 'denys.jpg',        width: 200,  q: 80 },
  { src: 'arcanjo.jpg',      width: 200,  q: 80 },
  { src: 'natanael.jpg',     width: 200,  q: 80 },
  { src: 'minervini.jpg',    width: 200,  q: 80 },
];

(async () => {
  for (const j of jobs) {
    const inPath = path.join(IMG, j.src);
    const outName = j.src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outPath = path.join(IMG, outName);
    const meta = await sharp(inPath).metadata();
    const info = await sharp(inPath)
      .resize({ width: Math.min(j.width, meta.width), withoutEnlargement: true })
      .webp({ quality: j.q })
      .toFile(outPath);
    console.log(
      `${j.src.padEnd(20)} ${meta.width}x${meta.height} -> ${outName} ${info.width}x${info.height}  ${(info.size/1024).toFixed(0)} KB`
    );
  }
  console.log('Imagens otimizadas.');
})().catch(e => { console.error(e); process.exit(1); });
