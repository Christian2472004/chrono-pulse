import React, { useEffect } from 'react';
import { HighScoreRecord } from '../game/types';
import { RotateCcw, Trophy, Flame, Crosshair, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageSelector } from './LanguageSelector';
import { t, tRank, Language } from '../i18n';

interface GameOverOverlayProps {
  record: HighScoreRecord;
  isNewBest: boolean;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  onMainMenu: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  shortcutEnabled?: boolean;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  record,
  isNewBest,
  onRestart,
  onOpenLeaderboard,
  onMainMenu,
  language,
  onLanguageChange,
  shortcutEnabled = true,
}) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isNewBest && !prefersReducedMotion) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [isNewBest]);

  // Keyboard shortcut for instant restart
  useEffect(() => {
    if (!shortcutEnabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart, shortcutEnabled]);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl shadow-rose-950/60 space-y-6">
        <div>
          <span className="text-xs font-chakra font-bold tracking-widest text-rose-500 uppercase">
            {t(language, 'gameover.depleted')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 tracking-wider mt-1">
            {t(language, 'gameover.terminated')}
          </h2>
        </div>

        {/* Big Score Card */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 shadow-inner">
          <span className="text-xs font-chakra text-slate-400 font-semibold tracking-wider">
            {t(language, 'gameover.finalScore')}
          </span>
          <div className="text-3xl sm:text-4xl font-orbitron font-black text-cyan-300 mt-0.5">
            {record.score.toLocaleString()}
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-chakra font-bold">
            <Award className="w-3.5 h-3.5" />
            {t(language, 'gameover.rank')}: {tRank(language, record.rankTitle)}
          </div>

          {isNewBest && (
            <div className="mt-2 text-xs font-chakra font-bold text-amber-400 animate-pulse">
              {t(language, 'gameover.newRecord')}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center font-chakra">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs mb-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{t(language, 'gameover.kills')}</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-slate-200">
              {record.kills}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{t(language, 'gameover.maxCombo')}</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-slate-200">
              {record.maxCombo}x
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-sky-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{t(language, 'gameover.survived')}</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-slate-200">
              {record.timeSurvivedSeconds}s
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 font-chakra">
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-slate-950 font-black tracking-wider text-sm flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-rose-500/40"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            {t(language, 'gameover.restart')}
          </button>

          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-bold tracking-wider text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            {t(language, 'gameover.highScores')}
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/80 text-slate-400 hover:text-slate-200 font-semibold tracking-wider text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {t(language, 'gameover.mainMenu')}
          </button>

          {/* Language Selector */}
          <div className="pt-2 flex justify-center">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
              showLabel={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
