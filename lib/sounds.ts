import type { SoundType } from "@/lib/preferences";

let audioContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) {
    audioContext = new AudioCtx();
  }
  return audioContext;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export async function playAlert(soundType: SoundType) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const now = ctx.currentTime;

  if (soundType === "beep") {
    tone(ctx, 880, now, 0.16, "sine", 0.12);
    tone(ctx, 880, now + 0.22, 0.16, "sine", 0.12);
    return;
  }

  if (soundType === "digital") {
    tone(ctx, 1240, now, 0.12, "square", 0.05);
    tone(ctx, 880, now + 0.14, 0.16, "square", 0.045);
    return;
  }

  if (soundType === "bell") {
    tone(ctx, 660, now, 1.1, "sine", 0.1);
    tone(ctx, 990, now, 0.9, "sine", 0.045);
    tone(ctx, 1320, now, 0.7, "sine", 0.025);
    return;
  }

  tone(ctx, 523, now, 0.7, "sine", 0.08);
  tone(ctx, 659, now + 0.12, 0.75, "sine", 0.06);
  tone(ctx, 784, now + 0.26, 0.95, "sine", 0.05);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
