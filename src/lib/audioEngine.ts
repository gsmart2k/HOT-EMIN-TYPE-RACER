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

function createDroneOscillator(
  freq: number,
  type: OscillatorType,
  gainVal: number,
  detune = 0
): [OscillatorNode, GainNode] {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  osc.detune.setValueAtTime(detune, c.currentTime);
  g.gain.setValueAtTime(gainVal, c.currentTime);
  osc.connect(g);
  g.connect(masterGain!);
  osc.start();
  return [osc, g];
}

export function startAmbient() {
  if (typeof window === "undefined") return;
  const c = getCtx();
  if (c.state === "suspended") c.resume();

  stopAmbient();

  // Sub-bass drone — deep ominous hum
  const [o1, g1] = createDroneOscillator(40, "sine", 0.5);
  // Mid drone with slow LFO
  const [o2, g2] = createDroneOscillator(80, "sawtooth", 0.08, -5);
  // High frequency tension layer
  const [o3, g3] = createDroneOscillator(160, "triangle", 0.04, 3);

  // LFO for tremolo on mid drone
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(0.15, c.currentTime);
  lfoGain.gain.setValueAtTime(0.03, c.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(g2.gain);
  lfo.start();

  // Low-pass filter for warmth
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(300, c.currentTime);
  filter.Q.setValueAtTime(1, c.currentTime);

  // Subtle noise layer
  const bufferSize = c.sampleRate * 2;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.015;
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.06, c.currentTime);
  noise.connect(noiseGain);
  noiseGain.connect(masterGain!);
  noise.start();

  droneNodes = [o1, g1, o2, g2, o3, g3, lfo, lfoGain, filter, noise, noiseGain];

  // Slow pulsing gain modulation for cinematic feel
  let t = 0;
  pulseInterval = setInterval(() => {
    if (!masterGain || isMuted) return;
    t += 0.05;
    const pulse = 0.18 + Math.sin(t * 0.4) * 0.03;
    masterGain.gain.setValueAtTime(pulse, c.currentTime);
  }, 100);
}

export function stopAmbient() {
  if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }
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
