// Сборка: src/index.html -> dist/index.html (самодостаточная страница без зависимостей).
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src", "index.html");
const out = join(root, "dist");

let html = readFileSync(src, "utf8");

// Исходник хранится как фрагмент (title, meta, style вверху, затем разметка).
// Для обычного хостинга собираем полноценный документ.
const cut = html.indexOf('<div class="wrap">');
if (cut < 0) throw new Error('В src/index.html не найден блок <div class="wrap">');
const headPart = html.slice(0, cut);
const bodyPart = html.slice(cut);

const version = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : "local";
const stamp = new Date().toISOString();

const reset = `<style>
html{color-scheme:dark;background:#0e0807}
body{margin:0}
[hidden]{display:none!important}
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
img{max-width:100%}
</style>`;

const doc = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0e0807">
<!-- build ${version} ${stamp} -->
${reset}
${headPart}
</head>
<body>
${bodyPart}
</body>
</html>
`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "index.html"), doc);
writeFileSync(join(out, ".nojekyll"), "");

const kb = (statSync(join(out, "index.html")).size / 1024).toFixed(1);
console.log(`Готово: dist/index.html, ${kb} КБ, сборка ${version}`);
