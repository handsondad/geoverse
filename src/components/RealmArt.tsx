import { useId } from "react";
import type { RealmId } from "../data/types.ts";

type Props = {
  realm?: RealmId | string;
  size?: "card" | "sm" | "icon";
};

function renderArt(id: RealmId, gradId: string) {
  switch (id) {
    case "tectonics":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe3dc" />
              <stop offset="100%" stopColor="#fff7ef" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <circle cx="48" cy="20" r="8" fill="#ff9f43" opacity="0.55" />
          <circle cx="44" cy="14" r="5" fill="#ffd93d" opacity="0.65" />
          <path d="M12 78 L36 32 L60 32 L84 78 Z" fill="#9c5a3c" />
          <path d="M36 32 L48 36 L60 32 L54 44 L48 40 L42 44 Z" fill="#ff5232" />
          <path d="M44 32 Q48 16 52 32" fill="#ff7847" />
          <path d="M0 78 Q24 72 48 78 T96 78 L96 96 L0 96 Z" fill="#e07a5f" />
          <path d="M16 88 L42 88 M54 88 L80 88" stroke="#fff4e6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
        </svg>
      );
    case "weather":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dbeeff" />
              <stop offset="100%" stopColor="#f0f8ff" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <circle cx="70" cy="24" r="10" fill="#ffd93d" />
          <path d="M22 44 A12 12 0 0 1 36 26 A14 14 0 0 1 62 30 A10 10 0 0 1 60 50 L26 50 A10 10 0 0 1 22 44 Z" fill="#ffffff" stroke="#8cbef5" strokeWidth="2" />
          <path d="M30 56 L26 66 M42 56 L38 66 M54 56 L50 66" stroke="#4d96ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 72 Q26 56 54 70 T96 68 L96 96 L0 96 Z" fill="#8fd19e" />
          <path d="M46 72 L96 72 L96 96 L46 96 Z" fill="#f3c98b" opacity="0.65" />
        </svg>
      );
    case "china":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff0d6" />
              <stop offset="100%" stopColor="#fffaf0" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <circle cx="74" cy="22" r="9" fill="#ff7f50" opacity="0.85" />
          {/* 三级阶梯剪影 */}
          <path d="M0 32 L30 32 L38 52 L64 52 L72 70 L96 70 L96 96 L0 96 Z" fill="#e6b882" />
          <path d="M0 32 L30 32 L26 42 L10 42 Z" fill="#ffffff" opacity="0.8" />
          <path d="M12 36 Q38 48 56 58 T92 78" fill="none" stroke="#4d96ff" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="10" y="64" width="22" height="22" rx="5" fill="#d97706" />
          <text x="21" y="79" textAnchor="middle" fill="#fffaf0" fontSize="11" fontWeight="700">
            山河
          </text>
        </svg>
      );
    case "oceans":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d6f5f0" />
              <stop offset="100%" stopColor="#eefcff" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <path d="M10 38 Q30 22 52 38 T88 34" fill="none" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
          <path d="M84 34 L76 29 M84 34 L77 40" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" />
          <path d="M86 56 Q64 44 42 56 T10 54" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          <path d="M12 54 L20 49 M12 54 L19 60" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 70 Q18 62 36 70 T72 70 T96 70 L96 96 L0 96 Z" fill="#2aa89b" fillOpacity="0.85" />
          <path d="M6 82 Q22 77 38 82 T70 82 T94 82" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "sky":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <circle cx="20" cy="22" r="2" fill="#ffd93d" />
          <circle cx="76" cy="20" r="2.2" fill="#ffffff" />
          <circle cx="68" cy="36" r="1.5" fill="#ffd93d" />
          {/* 极光丝带 */}
          <path d="M8 26 Q32 14 54 24 T88 18" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
          {/* 倾斜 23.4° 的地球 */}
          <g transform="translate(48, 56) rotate(23.4)">
            <circle r="22" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
            <path d="M-12 -10 Q0 -14 10 -4 Q4 8 -8 10 Z" fill="#4ade80" />
            <ellipse cx="0" cy="0" rx="22" ry="6" fill="none" stroke="#fde047" strokeWidth="1.8" strokeDasharray="3 3" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "human":
      return (
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2f9ea" />
              <stop offset="100%" stopColor="#f5fff8" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" rx="22" fill={`url(#${gradId})`} />
          <circle cx="72" cy="22" r="9" fill="#ffd93d" />
          <rect x="20" y="34" width="14" height="36" rx="2" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.8" />
          <rect x="38" y="22" width="16" height="48" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1.8" />
          <rect x="58" y="40" width="16" height="30" rx="2" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.8" />
          <path d="M0 70 Q24 64 48 70 T96 68 L96 96 L0 96 Z" fill="#3bb273" />
          <path d="M0 82 Q30 76 60 82 T96 80" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
  }
}

export function RealmArt({ realm = "china", size = "card" }: Props) {
  const uid = useId().replace(/:/g, "");
  const valid: RealmId =
    realm === "tectonics" ||
    realm === "weather" ||
    realm === "china" ||
    realm === "oceans" ||
    realm === "sky" ||
    realm === "human"
      ? realm
      : "china";
  return <span className={`region-art is-${size}`}>{renderArt(valid, `art-${valid}-${uid}`)}</span>;
}
