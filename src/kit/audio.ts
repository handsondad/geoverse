let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function chime(ok: boolean) {
  const c = ac();
  if (!c) return;
  const now = c.currentTime;
  const notes = ok ? [523.25, 659.25, 783.99] : [330, 293.66];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.085);
    gain.gain.setValueAtTime(0.0001, now + i * 0.085);
    gain.gain.exponentialRampToValueAtTime(0.11, now + i * 0.085 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.085 + 0.24);
    osc.connect(gain).connect(c.destination);
    osc.start(now + i * 0.085);
    osc.stop(now + i * 0.085 + 0.26);
  });
}
