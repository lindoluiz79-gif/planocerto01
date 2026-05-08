import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist/client');
const assetsPath = path.join(distPath, 'assets');

// Find the main JS and CSS files
const files = fs.readdirSync(assetsPath);
const mainJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const mainCss = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlanoCerto - Encontre o Plano de Saúde Ideal</title>
  <meta name="description" content="Compare e encontre o melhor plano de saúde para você e sua família">
  <link rel="icon" type="image/png" href="/icon-192.png">
  <link rel="manifest" href="/manifest.webmanifest">
  ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}">` : ''}
</head>
<body>
  <div id="root"></div>
  ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ''}
</body>
</html>`;

fs.writeFileSync(path.join(distPath, 'index.html'), html);
console.log('✅ index.html generated successfully!');
