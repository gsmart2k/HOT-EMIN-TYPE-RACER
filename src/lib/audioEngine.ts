"use client";

let audio: HTMLAudioElement | null = null;
let isMuted = false;

// Separate AudioContext only for sound effects (click, error, beeps)
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// ─── Background music ───────────────────────────────────────────────────────

export function startAmbient() {
  if (typeof window === "undefined") return;
  if (!audio) {
    audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0;
  }
  audio.play().catch(() => {});
  let vol = 0;
  const fade = setInterval(() => {
    if (!audio) { clearInterval(fade); return; }
    vol = Math.min(vol + 0.01, isMuted ? 0 : 0.18);
    audio.volume = vol;
    if (vol >= 0.18 || isMuted) clearInterval(fade);
  }, 100);
}

export function stopAmbient() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

export function setMuted(mute: boolean) {
  isMuted = mute;
  if (audio) audio.volume = mute ? 0 : 0.18;
}

export function getMuted() { return isMuted; }

// ─── Sound effects ───────────────────────────────────────────────────────────

export function playClick() {
  if (isMuted || typeof window === "undefined") return;
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(800, c.currentTime);
  g.gain.setValueAtTime(0.04, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.05);
}

export function playError() {
  if (isMuted || typeof window === "undefined") return;
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.12);
  g.gain.setValueAtTime(0.08, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.12);
}

export function playCountdownBeep(isGo = false) {
  if (isMuted || typeof window === "undefined") return;
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(isGo ? 880 : 440, c.currentTime);
  g.gain.setValueAtTime(0.15, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (isGo ? 0.5 : 0.2));
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + (isGo ? 0.5 : 0.2));
}

export function playComplete() {
  if (isMuted || typeof window === "undefined") return;
  const c = getCtx();
  [0, 0.15, 0.3, 0.5].forEach((delay, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    const freqs = [440, 554, 659, 880];
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqs[i], c.currentTime + delay);
    g.gain.setValueAtTime(0.12, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.4);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + 0.4);
  });
}
