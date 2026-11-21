// Taman Kota — tiny WebAudio chimes, made live (no sound files).
// The context starts on the first user gesture; every call is safe
// before that and simply stays silent.

let ctx = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    ctx = null;
  }
  return ctx;
}

function tone(freq, at, dur, type, gain) {
  const ac = ensure();
  if (!ac || muted) return;
  if (ac.state === 'suspended') ac.resume();
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

/** A bright two-note chime that climbs with the streak. */
export function playFound(streak) {
  const base = 660 + Math.min(streak, 8) * 40;
  tone(base, 0, 0.16, 'sine', 0.16);
  tone(base * 1.5, 0.07, 0.22, 'sine', 0.14);
}

/** A short low buzz for a wrong click. */
export function playMiss() {
  tone(150, 0, 0.18, 'square', 0.08);
}

/** A soft ping when the hint ring appears. */
export function playHint() {
  tone(880, 0, 0.12, 'triangle', 0.12);
  tone(1174, 0.09, 0.16, 'triangle', 0.1);
}

/** A quick arpeggio when a level is cleared. */
export function playClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.24, 'sine', 0.14));
}

/** One soft tick for each of the last ten seconds. */
export function playTick() {
  tone(980, 0, 0.06, 'sine', 0.06);
}

/** Flip the mute switch; returns the new muted state. */
export function toggleMute() {
  muted = !muted;
  return muted;
}
