#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST_DIR = path.join(ROOT, "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".glb": "model/gltf-binary",
  ".mp3": "audio/mpeg",
  ".json": "application/json; charset=utf-8"
};

function findBrowser() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA ?? "", "Microsoft\\Edge\\Application\\msedge.exe"),
    path.join(process.env.LOCALAPPDATA ?? "", "Google\\Chrome\\Application\\chrome.exe")
  ];
  for (const bin of candidates) {
    if (bin && fs.existsSync(bin)) return bin;
  }
  throw new Error("未找到 Edge 或 Chrome");
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = (req.url || "/").split("?")[0];
      if (urlPath === "/") urlPath = "/index.html";
      const safeRel = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
      let filePath = path.join(DIST_DIR, safeRel);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      resolve({ server, port: server.address().port });
    });
  });
}

function launchCdpBrowser(bin, userDataDir) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      bin,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--remote-debugging-port=0",
        `--user-data-dir=${userDataDir}`,
        "about:blank"
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    let errBuf = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`浏览器启动超时: ${errBuf}`));
    }, 15000);
    proc.stderr.on("data", (chunk) => {
      errBuf += chunk.toString("utf8");
      const m = errBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        resolve({ proc, wsEndpoint: m[1] });
      }
    });
  });
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.errors = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method === "Runtime.exceptionThrown") {
        this.errors.push(msg.params?.exceptionDetails?.text || "Runtime exception");
      } else if (msg.method === "Runtime.consoleAPICalled" && msg.params?.type === "error") {
        this.errors.push(msg.params.args?.map((a) => a.value ?? a.description).join(" "));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evalJson(expr) {
    const res = await this.send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }
  close() {
    this.ws.close();
  }
}

const args = process.argv.slice(2);
const shotsIdx = args.indexOf("--shots");
const shotsDir = shotsIdx >= 0 ? path.resolve(ROOT, args[shotsIdx + 1] || "tmp-shots") : null;
if (shotsDir) fs.mkdirSync(shotsDir, { recursive: true });

if (!fs.existsSync(path.join(DIST_DIR, "index.html"))) {
  console.error("请先执行 npm run build");
  process.exit(1);
}

const routes = [
  { name: "hub", hash: "#/" },
  { name: "realm-tectonics", hash: "#/realm/tectonics" },
  { name: "realm-weather", hash: "#/realm/weather" },
  { name: "realm-china", hash: "#/realm/china" },
  { name: "story-pangaea", hash: "#/story/pangaea-drift" },
  { name: "story-everest", hash: "#/story/himalayas-everest" },
  { name: "story-rainshadow", hash: "#/story/rain-shadow-desert" },
  { name: "story-steps", hash: "#/story/china-three-steps" },
  { name: "story-qinling", hash: "#/story/qinling-huaihe-line" },
  { name: "story-gulfstream", hash: "#/story/gulf-stream-heater" },
  { name: "story-seasons", hash: "#/story/earth-tilt-seasons" },
  { name: "story-records", hash: "#/story/seven-continents-records" },
  { name: "story-rift", hash: "#/story/east-africa-rift" },
  { name: "story-elnino", hash: "#/story/el-nino-pacific" },
  { name: "story-huline", hash: "#/story/hu-huanyong-line" },
  { name: "story-atoll", hash: "#/story/coral-reef-atoll" },
  { name: "story-tides", hash: "#/story/moon-tides-bay" },
  { name: "story-polar", hash: "#/story/polar-arctic-antarctic" },
  { name: "story-mercator", hash: "#/story/globe-grid-mercator" },
  { name: "globe", hash: "#/globe" },
  { name: "atlas", hash: "#/atlas" },
  { name: "quiz", hash: "#/quiz" }
];

const viewports = [
  { tag: "desktop", width: 1280, height: 900 },
  { tag: "mobile", width: 390, height: 844 }
];

const { server, port } = await startStaticServer();
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "geoverse-smoke-"));
const browserBin = findBrowser();
const { proc, wsEndpoint } = await launchCdpBrowser(browserBin, userDataDir);

try {
  const pagesRes = await fetch(`${wsEndpoint.replace("ws://", "http://").replace(/\/devtools\/browser\/.*/, "")}/json/list`);
  const targets = await pagesRes.json();
  const pageTarget = targets.find((t) => t.type === "page") ?? targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener("open", res, { once: true }));
  const cdp = new CdpClient(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  let failures = 0;
  for (const vp of viewports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 600
    });

    for (const rt of routes) {
      cdp.errors.length = 0;
      await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/${rt.hash}` });
      let audit = null;
      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((r) => setTimeout(r, 250));
        audit = await cdp.evalJson(`(() => {
          const h1 = document.querySelector("h1")?.textContent?.trim() || "";
          const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
          const overlaps = [];
          for (const svg of document.querySelectorAll("svg.map-stage-svg")) {
            const texts = [...svg.querySelectorAll("text")].filter((t) => {
              const st = getComputedStyle(t);
              return st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) > 0.05 && t.textContent?.trim();
            });
            const boxes = texts.map((t) => ({ txt: t.textContent.trim(), r: t.getBoundingClientRect() })).filter((b) => b.r.width > 0 && b.r.height > 0);
            for (let i = 0; i < boxes.length; i++) {
              for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i].r, b = boxes[j].r;
                const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
                const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
                if (ix > 4 && iy > 3) overlaps.push(boxes[i].txt + " vs " + boxes[j].txt);
              }
            }
          }
          return { h1, overflow, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overlaps };
        })()`);
        if (audit?.h1) break;
      }
      await new Promise((r) => setTimeout(r, 250));

      const errCount = cdp.errors.length;
      const ok = Boolean(audit?.h1) && !audit.overflow && audit.overlaps.length === 0 && errCount === 0;
      if (!ok) {
        failures += 1;
        console.error(`❌ [${vp.tag}] ${rt.name}:`, { ...audit, errors: cdp.errors });
      } else {
        console.log(`✅ [${vp.tag}] ${rt.name}: "${audit.h1}"`);
      }

      if (shotsDir && (vp.tag === "desktop" || rt.name === "hub" || rt.name === "story-everest")) {
        const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(shotsDir, `${vp.tag}-${rt.name}.png`), Buffer.from(shot.data, "base64"));
      }
    }

    // 额外交互巡检（桌面端）：切换故事剖面分幕并检查文字零重叠 + 走完一关经纬寻宝全程，拦截白屏与 SVG 溢出
    if (vp.tag === "desktop") {
      const checkSceneStories = [
        "globe-grid-mercator",
        "nile-amazon-rivers",
        "east-africa-rift",
        "el-nino-pacific",
        "hu-huanyong-line",
        "coral-reef-atoll",
        "moon-tides-bay",
        "polar-arctic-antarctic"
      ];
      for (const sid of checkSceneStories) {
        cdp.errors.length = 0;
        await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/#/story/${sid}` });
        await new Promise((r) => setTimeout(r, 400));
        const pillCount = await cdp.evalJson(`document.querySelectorAll(".map-scene-pill").length`);
        const allOverlaps = [];
        for (let i = 0; i < pillCount; i++) {
          await cdp.evalJson(`document.querySelectorAll(".map-scene-pill")[${i}]?.click()`);
          await new Promise((r) => setTimeout(r, 120));
          const ov = await cdp.evalJson(`(() => {
            const overlaps = [];
            for (const svg of document.querySelectorAll("svg.map-stage-svg")) {
              const texts = [...svg.querySelectorAll("text")].filter((t) => {
                const st = getComputedStyle(t);
                return st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) > 0.05 && t.textContent?.trim();
              });
              const boxes = texts.map((t) => ({ txt: t.textContent.trim(), r: t.getBoundingClientRect() })).filter((b) => b.r.width > 0 && b.r.height > 0);
              for (let a = 0; a < boxes.length; a++) {
                for (let b = a + 1; b < boxes.length; b++) {
                  const ra = boxes[a].r, rb = boxes[b].r;
                  const ix = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
                  const iy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
                  if (ix > 4 && iy > 3) overlaps.push(boxes[a].txt + " vs " + boxes[b].txt);
                }
              }
            }
            return overlaps;
          })()`);
          if (ov?.length) allOverlaps.push(`scene ${i + 1}: ${ov.join("; ")}`);
        }
        if (cdp.errors.length > 0 || allOverlaps.length > 0) {
          failures += 1;
          console.error(`❌ [desktop] story-${sid} scenes:`, { overlaps: allOverlaps, errors: cdp.errors });
        } else {
          console.log(`✅ [desktop] story-${sid} 全 ${pillCount} 幕切换零重叠无报错`);
        }
      }

      cdp.errors.length = 0;
      await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/#/quiz` });
      await new Promise((r) => setTimeout(r, 450));
      await cdp.evalJson(`[...document.querySelectorAll('[role="tab"]')][1]?.click()`);
      await new Promise((r) => setTimeout(r, 250));
      for (let q = 0; q < 4; q++) {
        await cdp.evalJson(`(() => {
          const svg = document.querySelector("svg.map-stage-svg");
          if (!svg) return;
          const r = svg.getBoundingClientRect();
          svg.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: r.left + r.width * 0.5, clientY: r.top + r.height * 0.5 }));
        })()`);
        await new Promise((r) => setTimeout(r, 100));
        await cdp.evalJson(`document.querySelector(".quiz-actions .primary-btn")?.click()`);
        await new Promise((r) => setTimeout(r, 100));
        await cdp.evalJson(`document.querySelector(".quiz-reveal .primary-btn")?.click()`);
        await new Promise((r) => setTimeout(r, 150));
      }
      const winVisible = await cdp.evalJson(`Boolean(document.querySelector(".win-card"))`);
      if (!winVisible || cdp.errors.length > 0) {
        failures += 1;
        console.error("❌ [desktop] quiz pinpoint full-stage completion:", { winVisible, errors: cdp.errors });
      } else {
        console.log("✅ [desktop] quiz 经纬寻宝 4 题通关结算无白屏");
      }
    }
  }

  cdp.close();
  if (failures > 0) process.exitCode = 1;
} finally {
  proc.kill("SIGKILL");
  server.close();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {
    // ignore Windows file lock
  }
}
