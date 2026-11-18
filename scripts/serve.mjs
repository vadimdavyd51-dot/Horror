// Локальный сервер для проверки сборки: npm run build && npm start
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "index.html");
if (!existsSync(file)) {
  console.error("Сначала выполните: npm run build");
  process.exit(1);
}
const port = Number(process.env.PORT) || 8080;
createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`http://localhost:${port}`));
