// Core 60fps Game Engine for CHRONO-PULSE
import { audio } from './audio';
import { 
  Player, Enemy, Projectile, Particle, FloatingText, ChronoPickup, 
  SlashWave, EnemyType, HighScoreRecord 
} from './types';
import { DIFFICULTY_TUNING, DifficultyMode } from './difficulty';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Viewport
  public width: number = 800;
  public height: number = 600;

  // Game states
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public isGameOver: boolean = false;

  // Time dilation mechanics (Chrono Surge)
  public timeScale: number = 1.0;
  public targetTimeScale: number = 1.0;
  public chronoSurgeActive: boolean = false;

  // Screenshake
  public shakeDuration: number = 0;
  public shakeMagnitude: number = 0;
  private shakeOffsetX: number = 0;
  private shakeOffsetY: number = 0;

  // Player & Entities
  public player!: Player;
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public pickups: ChronoPickup[] = [];
  public activeSlashes: SlashWave[] = [];

  // Progression & Score
  public score: number = 0;
  public combo: number = 0;
  public comboTimer: number = 0;
  public maxCombo: number = 0;
  public kills: number = 0;
  public timeSurvived: number = 0; // in seconds
  public wave: number = 1;

  // Spawn timers
  private spawnTimer: number = 0;
  private nextSpawnInterval: number = 1.5;
  private nextId: number = 1;

  // Grid background effect
  private gridOffset: number = 0;

  // Callback to inform React UI
  private onStateChange?: () => void;
  private onGameOver?: (record: HighScoreRecord) => void;

  // --- DYNAMIC DIFFICULTY DIRECTOR ---
  private difficultyLevel: number = 1.0; // 0.5 (easy) to 2.5 (brutal)
  // Difficulty mode picked in the menu — initialises and bounds the director
  public difficultyMode: DifficultyMode = 'NORMAL';
  private perfWindow: number = 30; // seconds of recent performance
  private perfSamples: Array<{ time: number; hpLost: number; kills: number; slashes: number; hits: number; dashReactions: number }> = [];
  private lastHp: number = 5;
  private slashCount: number = 0;
  private hitCount: number = 0;
  private killsThisWindow: number = 0;
  private dashReactionTimes: number[] = [];
  private lastDangerTime: number = 0;
  private dangerActive: boolean = false;

  // Base config (tunable)
  private readonly BASE_ENERGY_REGEN = 10;
  private readonly BASE_CHRONO_COST = 28;

  // Input states
  private keys: Record<string, boolean> = {};
  public mouseX: number = 0;
  public mouseY: number = 0;
  public isPointerDown: boolean = false;
  // True once a real mouse move happens — prevents aiming at stale (0,0)
  // coordinates on touch devices that never fire mousemove events
  public mouseActive: boolean = false;

  // Mobile virtual joystick coordinates
  public touchMoveVec: { x: number; y: number } | null = null;
  public touchAimVec: { x: number; y: number } | null = null;

  private animFrameId: number | null = null;
  private lastTimestamp: number = 0;

  constructor(
    canvas: HTMLCanvasElement, 
    onStateChange?: () => void,
    onGameOver?: (record: HighScoreRecord) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    this.onStateChange = onStateChange;
    this.onGameOver = onGameOver;

    this.resize();
    this.reset();
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile efficiency
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;
      this.ctx.scale(dpr, dpr);
    }
  }

  public setDifficultyMode(mode: DifficultyMode) {
    this.difficultyMode = mode;
  }

  public reset() {
    const tuning = DIFFICULTY_TUNING[this.difficultyMode];
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.maxCombo = 0;
    this.kills = 0;
    this.timeSurvived = 0;
    this.wave = 1;
    this.isGameOver = false;
    this.isPaused = false;
    this.timeScale = 1.0;
    this.targetTimeScale = 1.0;
    this.chronoSurgeActive = false;

    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.pickups = [];
    this.activeSlashes = [];

    this.player = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 0,
      vy: 0,
      radius: 18,
      angle: 0,
      speed: 340,
      chronoEnergy: 100,
      maxEnergy: 100,
      health: tuning.maxHealth,
      maxHealth: tuning.maxHealth,
      dashCooldown: 0,
      dashTimer: 0,
      isDashing: false,
      slashAngle: 0,
      slashTimer: 0,
      slashActive: false,
      slashCooldown: 0,
      invulnerableTimer: 0
    };

    this.spawnTimer = 0;
    this.nextSpawnInterval = 1.8;

    // Difficulty Director init — starting level comes from the chosen mode
    this.difficultyLevel = tuning.start;
    this.perfSamples = [];
    this.lastHp = tuning.maxHealth; // Match player.maxHealth
    this.slashCount = 0;
    this.hitCount = 0;
    this.killsThisWindow = 0;
    this.dashReactionTimes = [];
    this.lastDangerTime = 0;
    this.dangerActive = false;

    // Spawn 2 starter drones immediately so the action starts in under 2 seconds!
    this.spawnEnemy('DRONE');
    this.spawnEnemy('DRONE');
  }

  // --- DIFFICULTY DIRECTOR METHODS ---

  private recordPerformanceSample(_dt: number) {
    const now = this.timeSurvived;
    const hpLost = this.lastHp - this.player.health;
    
    this.perfSamples.push({
      time: now,
      hpLost,
      kills: this.killsThisWindow, // Kills THIS window only
      slashes: this.slashCount,
      hits: this.hitCount,
      dashReactions: this.dashReactionTimes.length
    });

    // Reset counters for next window
    this.lastHp = this.player.health;
    this.slashCount = 0;
    this.hitCount = 0;
    this.killsThisWindow = 0;
    this.dashReactionTimes = [];

    // Keep only recent window
    const cutoff = now - this.perfWindow;
    this.perfSamples = this.perfSamples.filter(s => s.time > cutoff);

    // Evaluate and adjust difficulty every sample
    this.evaluateDifficulty();
  }

  private evaluateDifficulty() {
    if (this.perfSamples.length < 1) return;

    const recent = this.perfSamples.slice(-3); // Last ~90s
    const avgHpLost = recent.reduce((sum, s) => sum + s.hpLost, 0) / recent.length;
    const avgKills = recent.reduce((sum, s) => sum + s.kills, 0) / recent.length;
    const avgAccuracy = recent.reduce((sum, s) => sum + (s.slashes > 0 ? s.hits / s.slashes : 1), 0) / recent.length;
    const avgDashReactions = recent.reduce((sum, s) => sum + s.dashReactions, 0) / recent.length;

    // Target: player loses ~0.3 HP per 30s window at ideal difficulty
    const targetHpLost = 0.3;
    const targetAccuracy = 0.45;
    const targetDashReactions = 1.5;

    let adjustment = 0;

    // HP pressure (most important)
    if (avgHpLost > 1.5) adjustment -= 0.25; // Getting shredded -> much easier
    else if (avgHpLost > targetHpLost * 2) adjustment -= 0.12; // Struggling -> easier
    else if (avgHpLost < targetHpLost * 0.5) adjustment += 0.08; // Breezing -> harder

    // Accuracy
    if (avgAccuracy > targetAccuracy * 1.3) adjustment += 0.08;
    else if (avgAccuracy < targetAccuracy * 0.7) adjustment -= 0.08;

    // Dash reactions (player awareness)
    if (avgDashReactions > targetDashReactions * 1.5) adjustment += 0.05;
    else if (avgDashReactions < targetDashReactions * 0.5) adjustment -= 0.05;

    // Kill rate (engagement) - per 30s window
    if (avgKills > 12) adjustment += 0.05;
    else if (avgKills < 3) adjustment -= 0.05;

    // Apply with smoothing - clamp adjustment per evaluation, then keep the
    // level inside the bounds of the chosen difficulty mode
    adjustment = Math.max(-0.25, Math.min(0.25, adjustment));
    const tuning = DIFFICULTY_TUNING[this.difficultyMode];
    this.difficultyLevel = Math.max(tuning.min, Math.min(tuning.max, this.difficultyLevel + adjustment * 0.5));
  }

  private getDifficultyMultiplier(stat: 'spawn' | 'speed' | 'health' | 'projectile' | 'energyRegen' | 'chronoCost'): number {
    const dl = this.difficultyLevel;
    switch (stat) {
      case 'spawn': return Math.max(0.3, 2.0 - dl); // 1.5x at 0.5 → 0.3x floor (faster spawns = harder)
      case 'speed': return 0.7 + dl * 0.4; // 0.9x to 1.7x
      case 'health': return 0.8 + dl * 0.35; // 0.975x to 1.675x
      case 'projectile': return 0.85 + dl * 0.3; // 1.0x to 1.6x
      case 'energyRegen': return 2.0 - dl * 0.6; // 1.7x to 0.5x regen
      case 'chronoCost': return 0.7 + dl * 0.4; // 0.9x to 1.7x cost
      default: return 1.0;
    }
  }

  // Call when player dashes reactively (enemy projectile incoming within 200px)
  public recordDashReaction() {
    if (this.dangerActive) {
      this.dashReactionTimes.push(performance.now() - this.lastDangerTime);
      this.dangerActive = false;
    }
  }

  // Call when enemy fires projectile near player
  public signalDanger() {
    this.dangerActive = true;
    this.lastDangerTime = performance.now();
  }

  public start() {
    this.reset();
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    audio.startMusic();
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public pause() {
    this.isPaused = true;
    if (this.onStateChange) this.onStateChange();
  }

  public resume() {
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    if (this.onStateChange) this.onStateChange();
  }

  public triggerScreenShake(magnitude: number, duration: number) {
    this.shakeMagnitude = Math.max(this.shakeMagnitude, magnitude);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
  }

  // Set chrono slow-mo
  public setChronoSurge(active: boolean) {
    if (this.isGameOver || this.isPaused) return;

    if (active && this.player.chronoEnergy > 10) {
      if (!this.chronoSurgeActive) {
        this.chronoSurgeActive = true;
        this.targetTimeScale = 0.22; // Extreme slow motion!
        audio.playSlowMo(true);
        this.createShockwave(this.player.x, this.player.y, '#06b6d4', 40);
      }
    } else {
      if (this.chronoSurgeActive) {
        this.chronoSurgeActive = false;
        this.targetTimeScale = 1.0;
        audio.playSlowMo(false);
      }
    }
  }

  // Dash mechanic (directional burst with invincibility)
  public performDash() {
    if (this.player.dashCooldown > 0 || this.isGameOver || this.isPaused) return;

    let moveX = 0;
    let moveY = 0;

    if (this.touchMoveVec) {
      moveX = this.touchMoveVec.x;
      moveY = this.touchMoveVec.y;
    } else {
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
    }

    if (moveX === 0 && moveY === 0) {
      // Dash towards mouse/face angle if no directional movement
      moveX = Math.cos(this.player.angle);
      moveY = Math.sin(this.player.angle);
    } else {
      const len = Math.hypot(moveX, moveY);
      if (len > 0) {
        moveX /= len;
        moveY /= len;
      }
    }

    const dashSpeed = 750;
    this.player.vx = moveX * dashSpeed;
    this.player.vy = moveY * dashSpeed;
    this.player.isDashing = true;
    this.player.dashTimer = 0.18; // active duration
    this.player.dashCooldown = 0.65;
    this.player.invulnerableTimer = 0.25;

    // Record dash reaction for difficulty director
    this.recordDashReaction();

    audio.playDash();
    this.triggerScreenShake(4, 0.15);

    // Spawn cyber dash ghosts
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        id: this.nextId++,
        x: this.player.x + (Math.random() - 0.5) * 15,
        y: this.player.y + (Math.random() - 0.5) * 15,
        vx: -moveX * 120 + (Math.random() - 0.5) * 50,
        vy: -moveY * 120 + (Math.random() - 0.5) * 50,
        size: Math.random() * 5 + 3,
        color: '#38bdf8',
        alpha: 0.8,
        maxAlpha: 0.8,
        lifetime: 0,
        maxLifetime: 0.25,
        shape: 'spark'
      });
    }
  }

  // Energy Blade Slash
  /**
   * Aim at a point (canvas coordinates). Used by mobile tap/drag:
   * a tap aims instantly AND slashes (slash=true), a drag only re-aims.
   */
  public aimAt(x: number, y: number, slash: boolean = false) {
    if (this.isGameOver || this.isPaused) return;
    const dx = x - this.player.x;
    const dy = y - this.player.y;
    if (Math.hypot(dx, dy) < 6) return; // ignore taps right on the player
    this.player.angle = Math.atan2(dy, dx);
    if (slash) this.performSlash();
  }

  public performSlash() {
    if (this.player.slashCooldown > 0 || this.isGameOver || this.isPaused) return;

    this.slashCount++; // Track for difficulty director

    this.player.slashActive = true;
    this.player.slashTimer = 0.14;
    this.player.slashCooldown = 0.22;
    this.player.slashAngle = this.player.angle;

    audio.playSlash(1 + Math.min(1, this.combo * 0.05));

    // Create visual slashing arc wave
    this.activeSlashes.push({
      x: this.player.x,
      y: this.player.y,
      angle: this.player.angle,
      arc: Math.PI * 0.85,
      radius: 65,
      progress: 0,
      color: this.chronoSurgeActive ? '#38bdf8' : '#f43f5e'
    });

    // Check hit on enemies in front
    const slashRange = 72;
    const slashArc = Math.PI * 0.65; // cone angle
    let hitCount = 0;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      const dx = e.x - this.player.x;
      const dy = e.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= slashRange + e.radius) {
        // Angle check
        const enemyAngle = Math.atan2(dy, dx);
        let angleDiff = enemyAngle - this.player.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        if (Math.abs(angleDiff) <= slashArc) {
          hitCount++;
          this.hitCount++; // Track for difficulty director
          e.health -= 1;
          this.triggerScreenShake(7, 0.12);

          // Knockback
          const knockAngle = Math.atan2(dy, dx);
          e.vx += Math.cos(knockAngle) * 350;
          e.vy += Math.sin(knockAngle) * 350;

          // Blood / Sparks
          this.createHitSparks(e.x, e.y, e.color, 14);

          if (e.health <= 0) {
            this.killEnemy(i);
          } else {
            audio.playHit(this.combo);
            this.addFloatingText('HIT', e.x, e.y - 10, '#f43f5e');
          }
        }
      }
    }

    // Check hit on enemy projectiles (Deflect / Parrying)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.deflected) continue;

      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= slashRange + p.radius + 15) {
        p.deflected = true;
        // Reflect projectile back towards where player is facing with increased velocity!
        const reflectSpeed = 650;
        p.vx = Math.cos(this.player.angle) * reflectSpeed;
        p.vy = Math.sin(this.player.angle) * reflectSpeed;
        p.color = '#06b6d4';
        p.glowColor = '#22d3ee';
        p.damage = 2; // Extra strong reflected bullet
        p.lifetime = 0; // reset lifetime
        
        hitCount++;
        audio.playDeflect();
        this.triggerScreenShake(8, 0.15);
        this.addFloatingText('DEFLECT!', p.x, p.y - 12, '#38bdf8');
        this.createShockwave(p.x, p.y, '#38bdf8', 30);
        this.player.chronoEnergy = Math.min(this.player.maxEnergy, this.player.chronoEnergy + 12);
      }
    }

    if (hitCount > 0) {
      this.combo++;
      this.comboTimer = 2.4; // 2.4 seconds to continue combo
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      if (this.combo % 5 === 0) {
        audio.playCrit();
        this.addFloatingText(`${this.combo}x COMBO!`, this.player.x, this.player.y - 40, '#f59e0b', 1.4);
      }
    }
  }

  // Main Loop
  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    let dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Cap delta time to prevent spiraling after tab blur
    if (dt > 0.1) dt = 0.1;

    if (!this.isPaused && !this.isGameOver) {
      this.update(dt);
    }

    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Smooth time dilation interpolation
    this.timeScale += (this.targetTimeScale - this.timeScale) * Math.min(1, dt * 10);

    // Apply time dilation to game world, except player actions have higher agility in Chrono Surge!
    const worldDt = dt * this.timeScale;
    const playerDt = this.chronoSurgeActive ? dt * 0.75 : dt;

    this.timeSurvived += dt;
    this.wave = 1 + Math.floor(this.timeSurvived / 25);

    // Difficulty Director: record performance sample every 30s
    if (Math.floor(this.timeSurvived / this.perfWindow) !== Math.floor((this.timeSurvived - dt) / this.perfWindow)) {
      this.recordPerformanceSample(dt);
    }

    // Screen Shake decay
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeMagnitude * 2;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeMagnitude * 2;
      if (this.shakeDuration <= 0) {
        this.shakeMagnitude = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      }
    }

    // Chrono Surge Energy management
    if (this.chronoSurgeActive) {
      const chronoCostMult = this.getDifficultyMultiplier('chronoCost');
      this.player.chronoEnergy -= this.BASE_CHRONO_COST * chronoCostMult * dt;
      if (this.player.chronoEnergy <= 0) {
        this.player.chronoEnergy = 0;
        this.setChronoSurge(false);
      }
    } else {
      // Natural passive regen (adjusted by difficulty)
      const energyRegenMult = this.getDifficultyMultiplier('energyRegen');
      this.player.chronoEnergy = Math.min(this.player.maxEnergy, this.player.chronoEnergy + this.BASE_ENERGY_REGEN * energyRegenMult * dt);
    }

    // Combo timer
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    // Update Player
    this.updatePlayer(playerDt);

    // Update Spawning (adjusted by difficulty)
    const spawnMult = this.getDifficultyMultiplier('spawn');
    this.spawnTimer += worldDt;
    if (this.spawnTimer >= this.nextSpawnInterval * spawnMult) {
      this.spawnTimer = 0;
      this.spawnWaveGroup();
      // Increase spawn rate as game progresses
      this.nextSpawnInterval = Math.max(0.9, 2.6 - (this.wave * 0.12));
    }

    // Update Enemies
    this.updateEnemies(worldDt);

    // Update Projectiles
    this.updateProjectiles(worldDt);

    // Update Pickups
    this.updatePickups(worldDt);

    // Update Slash waves
    this.updateSlashes(playerDt);

    // Update Particles
    this.updateParticles(dt);

    // Update Floating text
    this.updateFloatingTexts(dt);
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
    if (p.dashCooldown > 0) p.dashCooldown -= dt;
    if (p.slashCooldown > 0) p.slashCooldown -= dt;

    if (p.slashActive) {
      p.slashTimer -= dt;
      if (p.slashTimer <= 0) p.slashActive = false;
    }

    if (p.isDashing) {
      p.dashTimer -= dt;
      if (p.dashTimer <= 0) {
        p.isDashing = false;
      }
    } else {
      // Normal movement input
      let moveX = 0;
      let moveY = 0;

      if (this.touchMoveVec) {
        moveX = this.touchMoveVec.x;
        moveY = this.touchMoveVec.y;
      } else {
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
      }

      if (moveX !== 0 && moveY !== 0 && !this.touchMoveVec) {
        const factor = Math.SQRT1_2;
        moveX *= factor;
        moveY *= factor;
      }

      // Smooth acceleration & friction
      const targetVx = moveX * p.speed;
      const targetVy = moveY * p.speed;
      p.vx += (targetVx - p.vx) * Math.min(1, dt * 14);
      p.vy += (targetVy - p.vy) * Math.min(1, dt * 14);
    }

    // Move player
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Viewport bounds collision
    const pad = p.radius + 6;
    if (p.x < pad) { p.x = pad; p.vx = 0; }
    if (p.x > this.width - pad) { p.x = this.width - pad; p.vx = 0; }
    if (p.y < pad) { p.y = pad; p.vy = 0; }
    if (p.y > this.height - pad) { p.y = this.height - pad; p.vy = 0; }

    // Aim angle — priority: touch aim (tap/drag) > movement direction > mouse.
    // On touch devices that never moved a mouse, keep the current facing
    // instead of snapping to the stale (0,0) mouse coordinates.
    if (this.touchAimVec) {
      p.angle = Math.atan2(this.touchAimVec.y, this.touchAimVec.x);
    } else if (this.touchMoveVec) {
      p.angle = Math.atan2(this.touchMoveVec.y, this.touchMoveVec.x);
    } else if (this.mouseActive) {
      p.angle = Math.atan2(this.mouseY - p.y, this.mouseX - p.x);
    }
  }

  private spawnWaveGroup() {
    const dl = this.difficultyLevel;
    
    // Hard cap on total enemies to prevent performance crash
    const MAX_ENEMIES = 40;
    if (this.enemies.length >= MAX_ENEMIES) return;
    
    // Base types always available
    const types: EnemyType[] = ['DRONE', 'DRONE'];
    
    // Progressive unlocks by wave
    if (this.wave >= 2) types.push('SNIPER');
    if (this.wave >= 3) types.push('SPLITTER');
    if (this.wave >= 4) types.push('ORB_WEAVER');
    if (this.wave >= 5) types.push('TITAN');

    // Difficulty-based weighting: higher difficulty = more elite enemies
    const weightedTypes: EnemyType[] = [...types];
    
    // Add extra SNIPER/ORB_WEAVER at higher difficulty
    if (dl > 1.3) {
      weightedTypes.push('SNIPER', 'ORB_WEAVER');
    }
    if (dl > 1.7) {
      weightedTypes.push('TITAN', 'SPLITTER');
    }
    if (dl > 2.1) {
      weightedTypes.push('TITAN', 'TITAN'); // Double titan chance
    }

    const chosenType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    this.spawnEnemy(chosenType);

    // Multi-spawn at higher waves
    if (this.wave > 3 && Math.random() < 0.4 && this.enemies.length < MAX_ENEMIES) {
      this.spawnEnemy('DRONE');
    }
    
    // Extra spawn at high difficulty
    if (dl > 1.5 && Math.random() < 0.3 && this.enemies.length < MAX_ENEMIES) {
      this.spawnEnemy('DRONE');
    }
  }

  private spawnEnemy(type: EnemyType, spawnX?: number, spawnY?: number) {
    let x = spawnX;
    let y = spawnY;

    if (x === undefined || y === undefined) {
      // Spawn at random edges outside player vision
      const edge = Math.floor(Math.random() * 4);
      const pad = 30;
      switch (edge) {
        case 0: // Top
          x = Math.random() * this.width;
          y = -pad;
          break;
        case 1: // Bottom
          x = Math.random() * this.width;
          y = this.height + pad;
          break;
        case 2: // Left
          x = -pad;
          y = Math.random() * this.height;
          break;
        default: // Right
          x = this.width + pad;
          y = Math.random() * this.height;
          break;
      }
    }

    const speedMult = this.getDifficultyMultiplier('speed');
    const healthMult = this.getDifficultyMultiplier('health');

    let radius = 16;
    let health = 1;
    let speed = 140;
    let color = '#ef4444';
    let glowColor = '#f87171';
    let points = 100;

    switch (type) {
      case 'DRONE':
        radius = 15;
        health = Math.max(1, Math.round(1 * healthMult));
        speed = (150 + Math.min(80, this.wave * 8)) * speedMult;
        color = '#ec4899'; // Hot pink
        glowColor = '#f472b6';
        points = 100;
        break;
      case 'SNIPER':
        radius = 18;
        health = Math.max(1, Math.round(2 * healthMult));
        speed = 90 * speedMult;
        color = '#a855f7'; // Purple
        glowColor = '#c084fc';
        points = 250;
        break;
      case 'SPLITTER':
        radius = 22;
        health = Math.max(1, Math.round(2 * healthMult));
        speed = 110 * speedMult;
        color = '#eab308'; // Amber
        glowColor = '#fde047';
        points = 200;
        break;
      case 'MINI_DRONE':
        radius = 10;
        health = Math.max(1, Math.round(1 * healthMult));
        speed = 195 * speedMult;
        color = '#f97316'; // Orange
        glowColor = '#fb923c';
        points = 80;
        break;
      case 'ORB_WEAVER':
        radius = 20;
        health = Math.max(1, Math.round(3 * healthMult));
        speed = 75 * speedMult;
        color = '#06b6d4'; // Cyan
        glowColor = '#67e8f9';
        points = 350;
        break;
      case 'TITAN':
        radius = 30;
        health = Math.max(1, Math.round(5 * healthMult));
        speed = 65 * speedMult;
        color = '#dc2626'; // Deep Red
        glowColor = '#f87171';
        points = 600;
        break;
    }

    this.enemies.push({
      id: this.nextId++,
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      health,
      maxHealth: health,
      speed,
      color,
      glowColor,
      attackTimer: Math.random() * 1.5,
      stateTimer: 0,
      angle: 0,
      points
    });
  }

  private updateEnemies(dt: number) {
    const p = this.player;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      const dist = Math.hypot(dx, dy);
      e.angle = Math.atan2(dy, dx);

      // AI Logic per archetype
      if (e.type === 'DRONE' || e.type === 'MINI_DRONE') {
        // Direct intercept
        const targetVx = Math.cos(e.angle) * e.speed;
        const targetVy = Math.sin(e.angle) * e.speed;
        e.vx += (targetVx - e.vx) * Math.min(1, dt * 5);
        e.vy += (targetVy - e.vy) * Math.min(1, dt * 5);
      } 
      else if (e.type === 'SNIPER') {
        // Keep ideal distance of 280px
        const idealDist = 280;
        if (dist < idealDist - 30) {
          // Back away
          e.vx -= Math.cos(e.angle) * e.speed * dt * 4;
          e.vy -= Math.sin(e.angle) * e.speed * dt * 4;
        } else if (dist > idealDist + 30) {
          e.vx += Math.cos(e.angle) * e.speed * dt * 4;
          e.vy += Math.sin(e.angle) * e.speed * dt * 4;
        }
        e.attackTimer += dt;
        if (e.attackTimer >= 2.5) {
          e.attackTimer = 0;
          this.fireProjectile(e.x, e.y, e.angle, 380, '#c084fc');
          if (dist < 350) this.signalDanger();
        }
      } 
      else if (e.type === 'ORB_WEAVER') {
        // Spiral motion around player
        const orbitAngle = e.angle + Math.PI / 2;
        e.vx = Math.cos(orbitAngle) * e.speed * 0.8;
        e.vy = Math.sin(orbitAngle) * e.speed * 0.8;
        if (dist > 220) {
          e.vx += Math.cos(e.angle) * e.speed * 0.5;
          e.vy += Math.sin(e.angle) * e.speed * 0.5;
        }
        e.attackTimer += dt;
        if (e.attackTimer >= 2.8) {
          e.attackTimer = 0;
          // 3-way ring shot
          for (let k = -1; k <= 1; k++) {
            this.fireProjectile(e.x, e.y, e.angle + k * 0.28, 260, '#06b6d4');
          }
          if (dist < 300) this.signalDanger();
        }
      } 
      else if (e.type === 'TITAN') {
        // Relentless heavy march
        e.vx = Math.cos(e.angle) * e.speed;
        e.vy = Math.sin(e.angle) * e.speed;
        e.attackTimer += dt;
        if (e.attackTimer >= 3.0) {
          e.attackTimer = 0;
          // Radial 6-burst shockwave
          for (let k = 0; k < 6; k++) {
            const burstAngle = (Math.PI * 2 / 6) * k;
            this.fireProjectile(e.x, e.y, burstAngle, 220, '#ef4444');
          }
          if (dist < 400) this.signalDanger();
        }
      }
      else {
        e.vx = Math.cos(e.angle) * e.speed;
        e.vy = Math.sin(e.angle) * e.speed;
      }

      // Apply velocity
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      // Enemy separation (flocking avoidance)
      for (let j = i - 1; j >= 0; j--) {
        const other = this.enemies[j];
        const sepX = e.x - other.x;
        const sepY = e.y - other.y;
        const sepDist = Math.hypot(sepX, sepY);
        const minDist = e.radius + other.radius;
        if (sepDist < minDist && sepDist > 0) {
          const push = (minDist - sepDist) * 0.5;
          e.x += (sepX / sepDist) * push;
          e.y += (sepY / sepDist) * push;
          other.x -= (sepX / sepDist) * push;
          other.y -= (sepY / sepDist) * push;
        }
      }

      // Check collision with Player
      if (dist < p.radius + e.radius) {
        if (p.invulnerableTimer <= 0 && !p.isDashing) {
          this.hurtPlayer(1);
        }
      }
    }
  }

  private fireProjectile(x: number, y: number, angle: number, speed: number, color: string) {
    const projectileSpeedMult = this.getDifficultyMultiplier('projectile');
    this.projectiles.push({
      id: this.nextId++,
      x,
      y,
      vx: Math.cos(angle) * speed * projectileSpeedMult,
      vy: Math.sin(angle) * speed * projectileSpeedMult,
      radius: 6,
      color,
      glowColor: color,
      deflected: false,
      lifetime: 0,
      maxLifetime: 4.5,
      damage: 1
    });
  }

  private updateProjectiles(dt: number) {
    const p = this.player;

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.lifetime += dt;

      // Remove out of bounds or expired
      if (
        proj.lifetime >= proj.maxLifetime ||
        proj.x < -40 || proj.x > this.width + 40 ||
        proj.y < -40 || proj.y > this.height + 40
      ) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Collision with Enemies if deflected
      if (proj.deflected) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          const dist = Math.hypot(proj.x - e.x, proj.y - e.y);
          if (dist <= proj.radius + e.radius) {
            e.health -= proj.damage;
            this.createHitSparks(e.x, e.y, '#38bdf8', 12);
            this.projectiles.splice(i, 1);

            if (e.health <= 0) {
              this.killEnemy(j);
            } else {
              audio.playHit(this.combo);
            }
            break;
          }
        }
      } 
      // Collision with Player if enemy projectile
      else {
        const dist = Math.hypot(proj.x - p.x, proj.y - p.y);
        if (dist <= proj.radius + p.radius) {
          if (p.invulnerableTimer <= 0 && !p.isDashing) {
            this.hurtPlayer(proj.damage);
            this.projectiles.splice(i, 1);
          }
        }
      }
    }
  }

  private killEnemy(index: number) {
    const e = this.enemies[index];
    this.enemies.splice(index, 1);

    this.kills++;
    this.killsThisWindow++; // Track for difficulty director
    const comboMult = Math.max(1, 1 + this.combo * 0.2);
    const addedScore = Math.floor(e.points * comboMult);
    this.score += addedScore;

    audio.playHit(this.combo);
    this.createDeathExplosion(e.x, e.y, e.color);
    this.addFloatingText(`+${addedScore}`, e.x, e.y - 12, '#38bdf8', 1.2);

    // Splitter archetype splits into 2 mini-drones
    if (e.type === 'SPLITTER') {
      this.spawnEnemy('MINI_DRONE', e.x - 15, e.y);
      this.spawnEnemy('MINI_DRONE', e.x + 15, e.y);
    }

    // Drop battery/shield with chance
    if (Math.random() < 0.32) {
      const type = Math.random() < 0.22 ? 'SHIELD' : 'ENERGY';
      this.pickups.push({
        id: this.nextId++,
        x: e.x,
        y: e.y,
        radius: 12,
        type,
        pulseTimer: 0
      });
    }

    // Small chrono energy refund on every kill
    this.player.chronoEnergy = Math.min(this.player.maxEnergy, this.player.chronoEnergy + 8);

    // Health bonus on kill (small, but generous enough for casual runs)
    // 8% chance to restore 1 HP, only if not at max health
    if (this.player.health < this.player.maxHealth && Math.random() < 0.08) {
      this.player.health += 1;
      this.addFloatingText('+1 VIE', e.x, e.y - 28, '#10b981', 1.0);
      this.createShockwave(e.x, e.y, '#10b981', 20);
      audio.playPickup();
    }
  }

  private hurtPlayer(damage: number) {
    this.player.health -= damage;
    this.player.invulnerableTimer = 1.2; // 1.2s i-frames
    this.combo = 0; // Combo drop
    this.triggerScreenShake(14, 0.35);
    audio.playHurt();

    this.createShockwave(this.player.x, this.player.y, '#ef4444', 50);

    if (this.player.health <= 0) {
      this.gameOver();
    }
  }

  private gameOver() {
    this.isGameOver = true;
    this.setChronoSurge(false);
    audio.playGameOver();
    audio.stopMusic();
    this.triggerScreenShake(20, 0.6);

    const rankTitle = this.computeRank();

    const record: HighScoreRecord = {
      score: this.score,
      kills: this.kills,
      maxCombo: this.maxCombo,
      timeSurvivedSeconds: Math.floor(this.timeSurvived),
      date: new Date().toLocaleDateString(),
      rankTitle
    };

    if (this.onGameOver) {
      this.onGameOver(record);
    }
  }

  private computeRank(): string {
    if (this.score >= 15000) return 'CYBER OVERLORD [S+]';
    if (this.score >= 10000) return 'TIME WEAVER [S]';
    if (this.score >= 6000) return 'CHRONO KNIGHT [A]';
    if (this.score >= 3000) return 'NEON SLICER [B]';
    if (this.score >= 1200) return 'GRID INITIATE [C]';
    return 'ROOKIE OPERATOR [D]';
  }

  private updatePickups(dt: number) {
    const p = this.player;

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      item.pulseTimer += dt * 4;

      // Magnetic pull when close
      const dx = p.x - item.x;
      const dy = p.y - item.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 120) {
        const pull = 380 * dt;
        item.x += (dx / dist) * pull;
        item.y += (dy / dist) * pull;
      }

      // Collect
      if (dist < p.radius + item.radius) {
        audio.playPickup();
        if (item.type === 'ENERGY') {
          p.chronoEnergy = Math.min(p.maxEnergy, p.chronoEnergy + 40);
          this.addFloatingText('+CHRONO SURGE', item.x, item.y - 10, '#06b6d4');
        } else if (item.type === 'SHIELD') {
          p.health = Math.min(p.maxHealth, p.health + 1);
          this.addFloatingText('+SHIELD MATRIX', item.x, item.y - 10, '#10b981');
        }
        this.createShockwave(item.x, item.y, '#38bdf8', 25);
        this.pickups.splice(i, 1);
      }
    }
  }

  private updateSlashes(dt: number) {
    for (let i = this.activeSlashes.length - 1; i >= 0; i--) {
      const s = this.activeSlashes[i];
      s.progress += dt * 6.5; // Quick slash animation
      if (s.progress >= 1) {
        this.activeSlashes.splice(i, 1);
      }
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.lifetime += dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.alpha = pt.maxAlpha * (1 - pt.lifetime / pt.maxLifetime);

      if (pt.lifetime >= pt.maxLifetime) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const txt = this.floatingTexts[i];
      txt.y += txt.vy * dt;
      txt.alpha -= dt * 1.2;
      if (txt.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // FX Helpers
  public createHitSparks(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 260;
      this.particles.push({
        id: this.nextId++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        maxAlpha: 1,
        lifetime: 0,
        maxLifetime: 0.35 + Math.random() * 0.25,
        shape: 'spark'
      });
    }
  }

  public createDeathExplosion(x: number, y: number, color: string) {
    this.createHitSparks(x, y, color, 20);
    this.createShockwave(x, y, color, 45);
  }

  public createShockwave(x: number, y: number, color: string, radius: number) {
    this.particles.push({
      id: this.nextId++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: radius,
      color,
      alpha: 0.9,
      maxAlpha: 0.9,
      lifetime: 0,
      maxLifetime: 0.28,
      shape: 'ring'
    });
  }

  public addFloatingText(text: string, x: number, y: number, color: string, scale: number = 1) {
    this.floatingTexts.push({
      id: this.nextId++,
      x,
      y,
      text,
      color,
      alpha: 1,
      scale,
      vy: -55
    });
  }

  // --- RENDER PASS ---

  private render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    // Screenshake transform
    ctx.translate(this.shakeOffsetX, this.shakeOffsetY);

    // 1. Cyber Dark Background
    ctx.fillStyle = '#050711';
    ctx.fillRect(0, 0, w, h);

    // 2. Neon Perspective Grid Lines
    this.renderGrid(ctx, w, h);

    // 3. Chrono Surge Horizon Vignette Effect
    if (this.chronoSurgeActive || this.timeScale < 0.9) {
      const surgeIntensity = 1 - this.timeScale;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(1, `rgba(6, 182, 212, ${0.35 * surgeIntensity})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 4. Render Pickups
    for (const p of this.pickups) {
      this.renderPickup(ctx, p);
    }

    // 5. Render Projectiles
    for (const proj of this.projectiles) {
      this.renderProjectile(ctx, proj);
    }

    // 6. Render Enemies
    for (const e of this.enemies) {
      this.renderEnemy(ctx, e);
    }

    // 7. Render Slashes
    for (const s of this.activeSlashes) {
      this.renderSlash(ctx, s);
    }

    // 8. Render Player
    this.renderPlayer(ctx);

    // 9. Render Particles
    for (const pt of this.particles) {
      this.renderParticle(ctx, pt);
    }

    // 10. Render Floating Texts
    for (const txt of this.floatingTexts) {
      this.renderFloatingText(ctx, txt);
    }

    ctx.restore();
  }

  private renderGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';

    const gridSize = 45;
    this.gridOffset = (this.gridOffset + (this.chronoSurgeActive ? 0.3 : 1.2)) % gridSize;

    // Vertical lines
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = this.gridOffset; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Cross accents
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    for (let x = 0; x < w; x += gridSize * 2) {
      for (let y = this.gridOffset; y < h; y += gridSize * 2) {
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    }

    ctx.restore();
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Invulnerability flashing
    if (p.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.restore();
      return;
    }

    // Dash trail / Afterimage glow
    if (p.isDashing) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 25;
    }

    // Aim Laser Line Guide
    ctx.save();
    ctx.rotate(p.angle);
    const laserGrad = ctx.createLinearGradient(0, 0, 160, 0);
    laserGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
    laserGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.strokeStyle = laserGrad;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(p.radius, 0);
    ctx.lineTo(160, 0);
    ctx.stroke();
    ctx.restore();

    // Player Avatar: Cyber Blade Ronin triangle/chassis
    ctx.rotate(p.angle);

    // Glowing core aura
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.moveTo(p.radius + 6, 0);
    ctx.lineTo(-p.radius, -p.radius * 0.85);
    ctx.lineTo(-p.radius * 0.5, 0);
    ctx.lineTo(-p.radius, p.radius * 0.85);
    ctx.closePath();
    ctx.fill();

    // Inner Neon Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Dual energy wing guards
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Chrono Field Shield Ring
    if (p.health > 1) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, p.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderSlash(ctx: CanvasRenderingContext2D, s: SlashWave) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    const alpha = 1 - s.progress;
    ctx.strokeStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 20;
    ctx.lineWidth = 6 * (1 - s.progress * 0.5);

    const currentRadius = s.radius * (0.4 + s.progress * 0.8);
    const startAngle = -s.arc / 2;
    const endAngle = s.arc / 2;

    ctx.beginPath();
    ctx.arc(0, 0, currentRadius, startAngle, endAngle);
    ctx.globalAlpha = alpha;
    ctx.stroke();

    ctx.restore();
  }

  private renderEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);

    ctx.shadowColor = e.glowColor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = e.color;

    if (e.type === 'DRONE' || e.type === 'MINI_DRONE') {
      // Sleek diamond interceptor
      ctx.beginPath();
      ctx.moveTo(e.radius, 0);
      ctx.lineTo(0, -e.radius * 0.7);
      ctx.lineTo(-e.radius * 0.8, 0);
      ctx.lineTo(0, e.radius * 0.7);
      ctx.closePath();
      ctx.fill();
    } else if (e.type === 'SNIPER') {
      // Triangular prism sniper
      ctx.beginPath();
      ctx.moveTo(e.radius * 1.3, 0);
      ctx.lineTo(-e.radius * 0.9, -e.radius * 0.8);
      ctx.lineTo(-e.radius * 0.5, 0);
      ctx.lineTo(-e.radius * 0.9, e.radius * 0.8);
      ctx.closePath();
      ctx.fill();

      // Aiming charge laser
      if (e.attackTimer > 1.4) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(e.radius * 1.3, 0);
        ctx.lineTo(400, 0);
        ctx.stroke();
      }
    } else if (e.type === 'SPLITTER') {
      // Hexagonal bio-core
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const ang = (Math.PI * 2 / 6) * k;
        const px = Math.cos(ang) * e.radius;
        const py = Math.sin(ang) * e.radius;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (e.type === 'ORB_WEAVER') {
      // Pulsing energy orb with spinning satellite
      ctx.beginPath();
      ctx.arc(0, 0, e.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.type === 'TITAN') {
      // Octagonal armored fortress
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const ang = (Math.PI * 2 / 8) * k;
        const px = Math.cos(ang) * e.radius;
        const py = Math.sin(ang) * e.radius;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Armor plating border
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Health bar above enemy if damaged
    if (e.health < e.maxHealth) {
      ctx.rotate(-e.angle); // orient horizontal
      const barW = e.radius * 2;
      const barH = 4;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(-barW / 2, -e.radius - 12, barW, barH);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-barW / 2, -e.radius - 12, barW * (e.health / e.maxHealth), barH);
    }

    ctx.restore();
  }

  private renderProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
    ctx.save();
    ctx.shadowColor = p.glowColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // Deflected plasma aura
    if (p.deflected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderPickup(ctx: CanvasRenderingContext2D, p: ChronoPickup) {
    ctx.save();
    ctx.translate(p.x, p.y);

    const pulse = 1 + Math.sin(p.pulseTimer) * 0.15;
    const color = p.type === 'ENERGY' ? '#06b6d4' : '#10b981';

    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = color;

    // Diamond crystal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.radius * pulse);
    ctx.lineTo(p.radius * pulse, 0);
    ctx.lineTo(0, p.radius * pulse);
    ctx.lineTo(-p.radius * pulse, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderParticle(ctx: CanvasRenderingContext2D, pt: Particle) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);

    if (pt.shape === 'ring') {
      ctx.strokeStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const expandRadius = pt.size * (pt.lifetime / pt.maxLifetime);
      ctx.arc(pt.x, pt.y, expandRadius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    }

    ctx.restore();
  }

  private renderFloatingText(ctx: CanvasRenderingContext2D, t: FloatingText) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, t.alpha);
    ctx.font = `bold ${Math.floor(15 * t.scale)}px 'Orbitron', monospace`;
    ctx.fillStyle = t.color;
    ctx.shadowColor = t.color;
    ctx.shadowBlur = 8;
    ctx.textAlign = 'center';
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  }

  // --- CONTROLLER HOOKS ---

  public getDifficultyLevel(): number {
    return this.difficultyLevel;
  }

  public handleKeyDown(code: string) {
    this.keys[code] = true;

    if (code === 'Space') {
      this.performSlash();
    } else if (code === 'ShiftLeft' || code === 'KeyC') {
      this.setChronoSurge(true);
    } else if (code === 'KeyE' || code === 'KeyF') {
      this.performDash();
    }
  }

  public handleKeyUp(code: string) {
    this.keys[code] = false;

    if (code === 'ShiftLeft' || code === 'KeyC') {
      this.setChronoSurge(false);
    }
  }

  public destroy() {
    this.isRunning = false;
    audio.stopMusic();
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }
}
