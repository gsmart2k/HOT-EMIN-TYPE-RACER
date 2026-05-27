"use client";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let droneNodes: AudioNode[] = [];
let pulseInterval: ReturnType<typeof setInterval> | null = null;
let isMuted = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }
  return ctx;
}


// Musical notes in Hz
const NOTES: Record<string, number> = {
  C3: 130.81, E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, E5: 659.25, G5: 783.99,
};

// Gentle repeating melody — lo-fi ambient feel
const MELODY = [
  "E4","G4","A4","C5","B4","G4","A4","E4",
  "D4","G4","A4","C5","A4","G4","E4","D4",
];

// Soft bass line
const BASS = ["C3","C3","G3","G3","A3","A3","E3","E3"];

let melodyTimer: ReturnType<typeof setTimeout> | null = null;
let bassTimer: ReturnType<typeof setTimeout> | null = null;

function playNote(
  freq: number,
  startTime: number,
  duration: number,
  gainVal: number,
  type: OscillatorType = "sine"
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  const filter = c.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1200, startTime);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
  g.gain.setValueAtTime(gainVal, startTime + duration * 0.7);
  g.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(filter);
  filter.connect(g);
  g.connect(masterGain!);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function startAmbient() {
  if (typeof window === "undefined") return;
  const c = getCtx();
  if (c.state === "suspended") c.resume();

  stopAmbient();

  const BPM = 72;
  const beat = 60 / BPM;

  let melodyStep = 0;
  let bassStep = 0;

  function scheduleMelody() {
    if (isMuted) { melodyTimer = setTimeout(scheduleMelody, beat * 1000); return; }
    const note = MELODY[melodyStep % MELODY.length];
    playNote(NOTES[note], c.currentTime, beat * 0.85, 0.07, "triangle");
    melodyStep++;
    melodyTimer = setTimeout(scheduleMelody, beat * 1000);
  }

  function scheduleBass() {
    if (isMuted) { bassTimer = setTimeout(scheduleBass, beat * 2000); return; }
    const note = BASS[bassStep % BASS.length];
    playNote(NOTES[note], c.currentTime, beat * 1.8, 0.09, "sine");
    bassStep++;
    bassTimer = setTimeout(scheduleBass, beat * 2 * 1000);
  }

  // Fade in master gain gently
  masterGain!.gain.setValueAtTime(0, c.currentTime);
  masterGain!.gain.linearRampToValueAtTime(0.18, c.currentTime + 2);

  scheduleMelody();
  scheduleBass();
}

export function stopAmbient() {
  if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }
  if (melodyTimer) { clearTimeout(melodyTimer); melodyTimer = null; }
  if (bassTimer) { clearTimeout(bassTimer); bassTimer = null; }
  droneNodes.forEach((n) => {
    try {
      if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) n.stop();
      n.disconnect();
    } catch {}
  });
  droneNodes = [];
}

export function setMuted(mute: boolean) {
  isMuted = mute;
  if (!masterGain || !ctx) return;
  masterGain.gain.setTargetAtTime(mute ? 0 : 0.18, ctx.currentTime, 0.3);
}

export function getMuted() { return isMuted; }

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
