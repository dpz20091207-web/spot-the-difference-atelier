// Tiny WebAudio sound effects — no audio files, everything is synthesized
// with oscillators, so the game needs no network and no assets.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  tone(freq, dur, type, gain, when = 0) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() { this.ensure(); this.tone(660, 0.06, "sine", 0.06); }

  found() {
    this.ensure();
    this.tone(659.25, 0.12, "sine", 0.14);
    this.tone(880, 0.18, "sine", 0.14, 0.09);
    this.tone(1318.5, 0.22, "triangle", 0.08, 0.18);
  }

  wrong() { this.ensure(); this.tone(110, 0.16, "sawtooth", 0.07); }

  hint() { this.ensure(); this.tone(1046.5, 0.1, "sine", 0.08); }

  levelDone() {
    this.ensure();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.16, "triangle", 0.12, i * 0.1));
  }

  win() {
    this.ensure();
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      this.tone(f, 0.22, "triangle", 0.12, i * 0.12));
  }
}
