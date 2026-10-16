// Game Type Definitions for CHRONO-PULSE

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type EnemyType = 
  | 'DRONE'       // Direct chaser
  | 'SNIPER'      // Keeps distance, charges beam, fires laser
  | 'SPLITTER'    // Splits into 2 mini-drones upon blade hit
  | 'MINI_DRONE'  // Agile fast swarm
  | 'ORB_WEAVER'  // Fires glowing rings of energy
  | 'TITAN';      // Armored tank requiring multiple slashes or counter-parries

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number; // Face direction
  speed: number;
  chronoEnergy: number; // 0 to 100 (Chronometer / Slow-mo fuel)
  maxEnergy: number;
  health: number; // Max 3 shields
  maxHealth: number;
  dashCooldown: number;
  dashTimer: number;
  isDashing: boolean;
  slashAngle: number;
  slashTimer: number;
  slashActive: boolean;
  slashCooldown: number;
  invulnerableTimer: number;
}

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  health: number;
  maxHealth: number;
  speed: number;
  color: string;
  glowColor: string;
  attackTimer: number;
  stateTimer: number;
  angle: number;
  points: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  deflected: boolean;
  lifetime: number;
  maxLifetime: number;
  damage: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  lifetime: number;
  maxLifetime: number;
  shape?: 'circle' | 'spark' | 'ring' | 'blade-trace';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

export interface ChronoPickup {
  id: number;
  x: number;
  y: number;
  radius: number;
  type: 'ENERGY' | 'SHIELD' | 'TIME_BOMB';
  pulseTimer: number;
}

export interface SlashWave {
  x: number;
  y: number;
  angle: number;
  arc: number; // Angle span, e.g. Math.PI * 0.75
  radius: number;
  progress: number; // 0 to 1
  color: string;
}

export interface HighScoreRecord {
  score: number;
  kills: number;
  maxCombo: number;
  timeSurvivedSeconds: number;
  date: string;
  rankTitle: string;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  slash: boolean;
  chrono: boolean;
  dash: boolean;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  touchAimX: number | null;
  touchAimY: number | null;
}
