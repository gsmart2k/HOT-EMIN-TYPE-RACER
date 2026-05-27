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


export function startAmbient() {
  if (typeof window === "undefined") return;
  const c = getCtx();
  if (c.state === "suspended") c.resume();

  stopAmbient();

  // Soft pad — four detuned sine waves forming a gentle chord (C maj)
  // Root + major third + fifth + octave, all slightly detuned for warmth
  const padLayers: [number, number][] = [
    [261.63, 0],    // C4
    [329.63, 4],    // E4 + tiny detune
    [392.00, -3],   // G4
    [523.25, 6],    // C5
  ];

  const allNodes: AudioNode[] = [];

  // Shared soft low-pass filter — removes any harshness
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, c.currentTime);
  filter.Q.setValueAtTime(0.5, c.currentTime);
  filter.connect(masterGain!);

  padLayers.forEach(([freq, detune]) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, c.currentTime);
    osc.detune.setValueAtTime(detune, c.currentTime);
    // Fade in gently over 3 seconds
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(0.06, c.currentTime + 3);
    osc.connect(g);
    g.connect(filter);
    osc.start();
    allNodes.push(osc, g);
  });

  // Slow breathing LFO — gentle volume swell every ~8 seconds
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(0.12, c.currentTime);
  lfoGain.gain.setValueAtTime(0.015, c.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain!.gain as unknown as AudioNode);
  lfo.start();

  // Very soft high shimmer — triangle wave one octave up for air
  const shimmer = c.createOscillator();
  const shimmerGain = c.createGain();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(1046.5, c.currentTime); // C6
  shimmerGain.gain.setValueAtTime(0, c.currentTime);
  shimmerGain.gain.linearRampToValueAtTime(0.012, c.currentTime + 4);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(filter);
  shimmer.start();

  droneNodes = [...allNodes, lfo, lfoGain, filter, shimmer, shimmerGain];

  // Slow breathing master gain pulse
  let t = 0;
  pulseInterval = setInterval(() => {
    if (!masterGain || isMuted) return;
    t += 0.03;
    const pulse = 0.16 + Math.sin(t * 0.25) * 0.025;
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
