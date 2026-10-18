// Короткие синтезированные звуки (WebAudio), без файлов.
(function () {
  let ctx = null, master = null;
  const Sfx = {
    volume: 0.5,
    muted: false,

    unlock() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.value = this.muted ? 0 : this.volume * 0.35;
    },

    setVolume(v) { this.volume = v; if (master) master.gain.value = this.muted ? 0 : v * 0.35; },

    tone(freq, dur, { type = 'sine', when = 0, gain = 0.6, slide = 0 } = {}) {
      if (!ctx || this.muted) return;
      const t = ctx.currentTime + when;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
    },

    move() { this.tone(520, 0.05, { type: 'triangle', gain: 0.18 }); },

    // Мажорное арпеджио; чем длиннее комбо, тем выше.
    correct(combo) {
      const base = 440 * Math.pow(2, Math.min(combo, 24) / 12);
      [0, 4, 7].forEach((st, i) => this.tone(base * Math.pow(2, st / 12), 0.16, { type: 'triangle', when: i * 0.05, gain: 0.35 }));
      if (combo > 0 && combo % 5 === 0) this.tone(base * 2, 0.3, { type: 'sine', when: 0.16, gain: 0.3 });
    },

    wrong() {
      this.tone(180, 0.28, { type: 'sawtooth', gain: 0.22, slide: -90 });
      this.tone(120, 0.32, { type: 'square', when: 0.04, gain: 0.12, slide: -50 });
    },

    golden() { [0, 7, 12, 16, 19].forEach((st, i) => this.tone(880 * Math.pow(2, st / 12), 0.12, { when: i * 0.04, gain: 0.2 })); },

    power() { this.tone(300, 0.35, { type: 'sine', gain: 0.3, slide: 900 }); },

    levelUp() { [0, 4, 7, 12, 7, 12, 16].forEach((st, i) => this.tone(392 * Math.pow(2, st / 12), 0.14, { type: 'triangle', when: i * 0.07, gain: 0.3 })); },

    gameOver() { [12, 7, 3, 0].forEach((st, i) => this.tone(262 * Math.pow(2, st / 12), 0.3, { type: 'triangle', when: i * 0.16, gain: 0.3 })); },

    achievement() { [0, 5, 9, 12].forEach((st, i) => this.tone(659 * Math.pow(2, st / 12), 0.18, { type: 'sine', when: i * 0.06, gain: 0.25 })); },
  };
  window.Sfx = Sfx;
})();
