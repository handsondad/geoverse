import type { GeoFigureSpec } from "../data/types.ts";

export function GeoFigure({ figure }: { figure: GeoFigureSpec }) {
  if (figure.kind === "bars") {
    const hasNegative = figure.items.some((i) => i.value < 0);
    const maxAbs = Math.max(...figure.items.map((i) => Math.abs(i.value)), 1);
    const maxPos = Math.max(...figure.items.map((i) => Math.max(0, i.value)), 0);
    const maxNeg = Math.max(...figure.items.map((i) => Math.max(0, -i.value)), 0);
    const totalSpan = Math.max(1, maxPos + maxNeg);
    const zeroPct = hasNegative ? Math.round((maxNeg / totalSpan) * 100) : 0;

    return (
      <figure className="geo-figure">
        <div className="geo-fig-bars">
          {figure.items.map((item) => {
            if (hasNegative) {
              const spanPct = Math.max(6, Math.round((Math.abs(item.value) / totalSpan) * 100));
              const leftPct = item.value >= 0 ? zeroPct : Math.max(0, zeroPct - spanPct);
              return (
                <div key={item.label} className="geo-fig-bar-row">
                  <span className="geo-fig-bar-lbl">{item.label}</span>
                  <span className="geo-fig-bar-track is-diverging">
                    <span className="geo-fig-bar-zero" style={{ left: `${zeroPct}%` }} aria-hidden="true" />
                    <span
                      className="geo-fig-bar-fill is-signed"
                      style={{ left: `${leftPct}%`, width: `${spanPct}%`, background: item.color }}
                    />
                  </span>
                  <strong className="geo-fig-bar-val">
                    {item.value > 0 ? `+${item.value}` : item.value} {item.unit}
                  </strong>
                </div>
              );
            }
            const pct = Math.max(10, Math.round((Math.abs(item.value) / maxAbs) * 100));
            return (
              <div key={item.label} className="geo-fig-bar-row">
                <span className="geo-fig-bar-lbl">{item.label}</span>
                <span className="geo-fig-bar-track">
                  <span
                    className="geo-fig-bar-fill"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </span>
                <strong className="geo-fig-bar-val">
                  {item.value} {item.unit}
                </strong>
              </div>
            );
          })}
        </div>
        <figcaption>
          {figure.caption}
          {hasNegative ? "（竖线为 0 基准）" : ""}
        </figcaption>
      </figure>
    );
  }

  if (figure.kind === "scale") {
    return (
      <figure className="geo-figure">
        <div className="geo-fig-scale">
          {figure.stops.map((s) => (
            <div
              key={s.label}
              className={`geo-fig-stop${s.hot ? " is-hot" : ""}`}
              style={{ borderColor: s.color, background: `${s.color}20` }}
            >
              <strong style={{ color: s.color }}>{s.label}</strong>
              <small>{s.note}</small>
            </div>
          ))}
        </div>
        <figcaption>{figure.caption}</figcaption>
      </figure>
    );
  }

  if (figure.kind === "elevation") {
    return (
      <figure className="geo-figure">
        <div className="geo-fig-elev">
          {figure.steps.map((st) => (
            <div key={st.name} className="geo-fig-elev-col">
              <span className="geo-fig-elev-h">{st.height}</span>
              <div
                className="geo-fig-elev-block"
                style={{ height: `${Math.max(24, st.pct)}px`, background: st.color }}
              />
              <small>{st.name}</small>
            </div>
          ))}
        </div>
        <figcaption>{figure.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="geo-figure">
      <div className="geo-fig-tilt">
        <svg viewBox="0 0 360 110" aria-hidden="true">
          <rect width="360" height="110" rx="14" fill="#1e1b4b" />
          <circle cx="44" cy="55" r="20" fill="#ffd93d" />
          <line x1="72" y1="36" x2="150" y2="36" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="72" y1="55" x2="150" y2="55" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="72" y1="74" x2="150" y2="74" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" />
          <g transform={`translate(182, 55) rotate(${figure.angleDeg})`}>
            <circle r="26" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
            <path d="M-14 -12 Q4 -16 14 -4 Q6 10 -12 12 Z" fill="#4ade80" />
            <line x1="-26" y1="0" x2="26" y2="0" stroke="#fde047" strokeWidth="2" />
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          </g>
          <text x="222" y="26" fill="#fef08a" fontSize="11" fontWeight="700">
            {figure.northNote}
          </text>
          <text x="222" y="92" fill="#bae6fd" fontSize="11" fontWeight="700">
            {figure.southNote}
          </text>
        </svg>
      </div>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}
