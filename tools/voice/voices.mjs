import { createHash } from "node:crypto";

export const voices = {
  nian: { voice: "zh-CN-YunxiaNeural", rate: "+0%" },
  dad: { voice: "zh-CN-YunxiNeural", rate: "-5%" }
};

/** 地理台词 → 适合 TTS 朗读的中文口语：剥离 emoji，规范温度、经纬度、单位与区间读法 */
export function speakable(text) {
  return String(text ?? "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, " ")
    .replace(/(\d+(?:\.\d+)?)\s*°\s*N\b/g, "北纬$1度")
    .replace(/(\d+(?:\.\d+)?)\s*°\s*S\b/g, "南纬$1度")
    .replace(/(\d+(?:\.\d+)?)\s*°\s*E\b/g, "东经$1度")
    .replace(/(\d+(?:\.\d+)?)\s*°\s*W\b/g, "西经$1度")
    .replace(/(\d+(?:\.\d+)?)\s*°/g, "$1度")
    .replace(/(\d+(?:\.\d+)?)\s*[–~～]\s*(\d+(?:\.\d+)?)/g, "$1到$2")
    .replace(/(^|[^\d])[−-](\d+(?:\.\d+)?)\s*℃/g, "$1零下$2摄氏度")
    .replace(/\s*℃/g, "摄氏度")
    .replace(/(^|[^\d])[−-](\d+(?:\.\d+)?)/g, "$1负$2")
    .replace(/\s*m³\/s/gi, "立方米每秒")
    .replace(/(\d+(?:\.\d+)?)\s*km\b/gi, "$1公里")
    .replace(/(\d+(?:\.\d+)?)\s*mm\b/gi, "$1毫米")
    .replace(/＜/g, "小于")
    .replace(/＞/g, "大于")
    .replace(/\s+/g, " ")
    .trim();
}

export function clipHash(who, text) {
  const { voice, rate } = voices[who];
  return createHash("sha1").update(`${voice}|${rate}|${speakable(text)}`).digest("hex").slice(0, 12);
}
