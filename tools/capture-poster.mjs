#!/usr/bin/env node
/**
 * 截取地理奇遇记首页 3D 小星球的首帧透明海报 → public/images/home-duo-poster.webp (1140×380)
 * 用法：先运行 npm run build，再运行 node tools/capture-poster.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "public", "images", "home-duo-poster.webp");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".glb": "model/gltf-binary",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};

const browserBin = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
].find((p) => fs.existsSync(p));

if (!browserBin) {
  throw new Error("未找到 Edge 或 Chrome");
}

const server = http.createServer((req, res) => {
  let u = (req.url || "/").split("?")[0];
  if (u === "/") u = "/index.html";
  const fp = path.join(DIST, path.normalize(u).replace(/^(\.\.[/\\])+/, ""));
  if (!fs.existsSync(fp)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(fp).pipe(res);
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "geoverse-poster-"));
const proc = spawn(
  browserBin,
  [
    "--headless=new",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDir}`,
    "about:blank"
  ],
  { stdio: ["ignore", "pipe", "pipe"] }
);

try {
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(() => reject(new Error(`Browser timeout: ${buf}`)), 15000);
    proc.stderr.on("data", (chunk) => {
      buf += chunk.toString("utf8");
      const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
  });

  const listUrl = `${wsUrl.replace("ws://", "http://").replace(/\/devtools\/browser\/.*/, "")}/json/list`;
  const targets = await (await fetch(listUrl)).json();
  const ws = new WebSocket((targets.find((t) => t.type === "page") ?? targets[0]).webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));

  let id = 0;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const cid = ++id;
      const onMsg = (ev) => {
        const msg = JSON.parse(String(ev.data));
        if (msg.id === cid) {
          ws.removeEventListener("message", onMsg);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
      ws.addEventListener("message", onMsg);
      ws.send(JSON.stringify({ id: cid, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send("Page.navigate", { url: `http://127.0.0.1:${port}/?poster=1#/` });

  let ready = false;
  for (let i = 0; i < 50; i += 1) {
    await new Promise((r) => setTimeout(r, 200));
    const res = await send("Runtime.evaluate", {
      expression: `Boolean(document.querySelector(".home-planet.is-3d .duo-canvas"))`,
      returnByValue: true
    });
    if (res.result?.value) {
      ready = true;
      break;
    }
  }
  if (!ready) throw new Error("3D 小星球未能在无头浏览器中初始化");

  const evalRes = await send("Runtime.evaluate", {
    expression: `(() => {
      const host = document.querySelector(".home-planet");
      host.style.width = "1140px";
      host.style.height = "380px";
      return new Promise((resolve) => {
        setTimeout(() => {
          const canvas = document.querySelector(".duo-canvas");
          resolve(canvas ? canvas.toDataURL("image/webp", 0.9) : "");
        }, 260);
      });
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  const dataUrl = evalRes.result?.value;
  if (!dataUrl || !String(dataUrl).startsWith("data:image/webp;base64,")) {
    throw new Error("导出 WebP 失败");
  }
  const buf = Buffer.from(String(dataUrl).replace(/^data:image\/webp;base64,/, ""), "base64");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buf);
  console.log(`✅ 已生成 ${path.relative(ROOT, OUT)} (${(buf.length / 1024).toFixed(1)} KB)`);
  ws.close();
} finally {
  proc.kill("SIGKILL");
  server.close();
  try {
    fs.rmSync(userDir, { recursive: true, force: true });
  } catch {
    // ignore Windows file lock
  }
}
