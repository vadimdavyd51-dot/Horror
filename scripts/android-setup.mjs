// Дополняет сгенерированный Android-проект: разрешение на микрофон для WebView.
// Запускается после `npx cap add android`.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = join(root, "android", "app", "src", "main", "AndroidManifest.xml");
if (!existsSync(manifest)) {
  console.error("Нет android/app/src/main/AndroidManifest.xml. Сначала выполните: npx cap add android");
  process.exit(1);
}

let xml = readFileSync(manifest, "utf8");
const perms = ["android.permission.RECORD_AUDIO", "android.permission.MODIFY_AUDIO_SETTINGS"];
const missing = perms.filter((p) => !xml.includes(`"${p}"`));
if (missing.length) {
  const lines = missing.map((p) => `    <uses-permission android:name="${p}" />`).join("\n");
  xml = xml.replace("</manifest>", `${lines}\n</manifest>`);
  writeFileSync(manifest, xml);
}
console.log("AndroidManifest: разрешения проверены" + (missing.length ? ", добавлено: " + missing.join(", ") : ", всё уже было"));
