// Web Audio API Sound Synthesizer & Procedural Cyberpunk Soundtrack
// Zero external audio assets required; zero latency; supports volume controls & mute

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.45;
  private sfxVolume: number = 0.65;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Music sequence tracking
  private isMusicPlaying: boolean = false;
  private tempoBpm: number = 136;
  private currentStep: number = 0;
  private musicTimer: number | null = null;
  private bassNotes = [110, 110, 130.81, 110, 146.83, 110, 130.81, 164.81]; // A2, C3, D3, E3
  private melodyNotes = [220, 261.63, 293.66, 329.63, 392.00, 440.00, 329.63, 293.66];

  constructor() {
    // Audio context will be lazy-initialized on first user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
    } catch {
      console.warn("Web Audio not supported or blocked");
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1.0, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  // --- SOUND EFFECTS ---

  // Blade Slash Sound
  public playSlash(pitchMultiplier = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450 * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(120 * pitchMultiplier, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Target Hit / Slice
  public playHit(combo = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    // Harmonic bell-like slice sound pitch shifts up with combo
    const pitch = Math.min(1200, 320 + combo * 35);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + 0.15);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.19);

    // Punchy click
    this.playNoiseSnap(0.04, 0.3);
  }

  // Critical / Combo hit
  public playCrit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    [1, 1.5, 2].forEach((ratio, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33 * ratio, t + i * 0.02);
      gain.gain.setValueAtTime(0.3, t + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + i * 0.02);
      osc.stop(t + 0.26);
    });
  }

  // Bullet Deflect / Reflect
  public playDeflect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  // Chrono Surge / Slow Motion trigger
  public playSlowMo(start: boolean) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    if (start) {
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
    } else {
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.25);
    }

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.46);
  }

  // Dash Whoosh
  public playDash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Hurt / Hit taken
  public playHurt() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.28);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.31);
  }

  // Game Over explosion
  public playGameOver() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.7);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.76);
  }

  // Chrono Battery / Crystal Pickup
  public playPickup() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t);
    osc.frequency.setValueAtTime(880, t + 0.05);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  // Noise generator helper
  private playNoiseSnap(duration: number, volume: number) {
    if (!this.ctx || !this.sfxGain) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(this.sfxGain);
    noise.start();
  }

  // --- DYNAMIC MUSIC GENERATOR (Cyberpunk Synthwave loop) ---

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.init();
    this.resume();
    this.isMusicPlaying = true;
    this.currentStep = 0;

    const stepIntervalMs = (60 / this.tempoBpm / 4) * 1000; // 16th notes
    this.musicTimer = window.setInterval(() => {
      this.tickMusicStep();
    }, stepIntervalMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private tickMusicStep() {
    if (!this.ctx || !this.musicGain || this.isMuted) {
      this.currentStep = (this.currentStep + 1) % 32;
      return;
    }

    const step = this.currentStep;
    const t = this.ctx.currentTime;

    // 1. Kick on beats 0, 4, 8, 12, 16, 20, 24, 28 (4-on-the-floor)
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, t);
      kickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

      kickGain.gain.setValueAtTime(0.45, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);
      kickOsc.start(t);
      kickOsc.stop(t + 0.13);
    }

    // 2. Hi-hat on offbeats (2, 6, 10, etc.)
    if (step % 4 === 2) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const hat = this.ctx.createBufferSource();
      hat.buffer = buffer;
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(7000, t);

      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.12, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      hat.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.musicGain);
      hat.start(t);
    }

    // 3. Synth Bass Arp on every 16th note
    const bassIdx = Math.floor(step / 4) % this.bassNotes.length;
    const rootBass = this.bassNotes[bassIdx];
    const bassFreq = (step % 2 === 0) ? rootBass : rootBass * 1.5;

    const bassOsc = this.ctx.createOscillator();
    const bassFilter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();

    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(bassFreq, t);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(650, t);
    bassFilter.frequency.exponentialRampToValueAtTime(220, t + 0.09);

    bassGain.gain.setValueAtTime(0.16, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.095);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.musicGain);
    bassOsc.start(t);
    bassOsc.stop(t + 0.1);

    // 4. Synth melody on specific rhythmic accents
    if ([0, 3, 6, 10, 14, 18, 22, 26, 28].includes(step)) {
      const note = this.melodyNotes[(step + 2) % this.melodyNotes.length];
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'triangle';
      leadOsc.frequency.setValueAtTime(note, t);

      leadGain.gain.setValueAtTime(0.12, t);
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      leadOsc.connect(leadGain);
      leadGain.connect(this.musicGain);
      leadOsc.start(t);
      leadOsc.stop(t + 0.19);
    }

    this.currentStep = (this.currentStep + 1) % 32;
  }
}

export const audio = new SoundEngine();
