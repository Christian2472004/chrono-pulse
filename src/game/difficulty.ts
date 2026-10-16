// Difficulty modes for CHRONO-PULSE
// Chosen on the start screen, remembered between runs, and fed to the
// adaptive Difficulty Director as start value + hard bounds.

export type DifficultyMode = 'FACILE' | 'NORMAL' | 'BRUTAL';

export interface DifficultyTuning {
  /** Starting adaptive difficulty level */
  start: number;
  /** Bounds within which the director may adapt */
  min: number;
  max: number;
  /** Starting (= max) shield points */
  maxHealth: number;
}

export const DIFFICULTY_TUNING: Record<DifficultyMode, DifficultyTuning> = {
  FACILE: { start: 0.6, min: 0.35, max: 1.2, maxHealth: 6 },
  NORMAL: { start: 0.85, min: 0.5, max: 2.5, maxHealth: 5 },
  BRUTAL: { start: 1.3, min: 1.0, max: 2.6, maxHealth: 4 },
};

export const DIFFICULTY_MODES: DifficultyMode[] = ['FACILE', 'NORMAL', 'BRUTAL'];

const DIFFICULTY_KEY = 'chrono_pulse_difficulty_v1';

export function loadDifficultyMode(): DifficultyMode {
  try {
    const stored = localStorage.getItem(DIFFICULTY_KEY);
    if (stored && DIFFICULTY_MODES.includes(stored as DifficultyMode)) {
      return stored as DifficultyMode;
    }
  } catch {
    // Local storage disabled or error
  }
  return 'NORMAL';
}

export function saveDifficultyMode(mode: DifficultyMode) {
  try {
    localStorage.setItem(DIFFICULTY_KEY, mode);
  } catch {
    // Ignore
  }
}
