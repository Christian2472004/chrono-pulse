import React from 'react';
import { GameEngine } from '../game/GameEngine';
import { Volume2, VolumeX, Pause, Play, Shield, Zap, Sparkles, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { t, Language } from '../i18n';

interface HUDProps {
  engine: GameEngine;
  isMuted: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  language: Language;
}

export const HUD: React.FC<HUDProps> = ({
  engine,
  isMuted,
  onToggleMute,
  onTogglePause,
  language,
}) => {
  const player = engine.player;
  const combo = engine.combo;
  const chronoPct = Math.min(100, Math.max(0, (player.chronoEnergy / player.maxEnergy) * 100));

  // Difficulty indicator
  const difficulty = engine.getDifficultyLevel();
  const getDifficultyIcon = () => {
    if (difficulty < 0.85) return <TrendingDown className="w-3 h-3 text-emerald-400" />;
    if (difficulty > 1.7) return <Flame className="w-3 h-3 text-violet-400" />;
    if (difficulty > 1.25) return <TrendingUp className="w-3 h-3 text-rose-400" />;
    return <Minus className="w-3 h-3 text-amber-400" />;
  };
  const getDifficultyLabel = () => {
    if (difficulty < 0.85) return t(language, 'hud.difficulty.easy') + ' ▼';
    if (difficulty > 1.7) return t(language, 'hud.difficulty.extreme') + ' ▲';
    if (difficulty > 1.25) return t(language, 'hud.difficulty.hard') + ' ▲';
    return t(language, 'hud.difficulty.normal') + ' ●';
  };
  const getDifficultyColor = () => {
    if (difficulty < 0.85) return 'text-emerald-400';
    if (difficulty > 1.7) return 'text-violet-400';
    if (difficulty > 1.25) return 'text-rose-400';
    return 'text-amber-400';
  };

  return (
    <header className="absolute inset-x-0 top-0 p-3 md:p-5 flex justify-between items-start pointer-events-none z-20 select-none">
      {/* Top Left: Health, Chrono Surge Bar & Wave */}
      <div className="flex flex-col gap-2">
        {/* Shield Points */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg">
          <Shield className="w-4 h-4 text-cyan-400" />
          <div className="flex gap-1.5 ml-1">
            {Array.from({ length: player.maxHealth }).map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-2.5 rounded-sm transition-all duration-300 ${
                  idx < player.health
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                    : 'bg-slate-800 border border-slate-700/50'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 ml-2">
            {t(language, 'hud.shield')} {player.health}/{player.maxHealth}
          </span>
        </div>

        {/* Chrono Energy Bar */}
        <div className="flex flex-col gap-1 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg w-52 sm:w-64">
          <div className="flex justify-between items-center text-[11px] font-chakra font-bold">
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              {t(language, 'hud.chronoMatrix')}
            </span>
            <span className={engine.chronoSurgeActive ? 'text-cyan-300 animate-pulse font-mono' : 'text-slate-400 font-mono'}>
              {Math.floor(chronoPct)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/60 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                engine.chronoSurgeActive
                  ? 'bg-gradient-to-r from-cyan-300 to-white shadow-[0_0_12px_#38bdf8]'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 shadow-[0_0_6px_#06b6d4]'
              }`}
              style={{ width: `${chronoPct}%` }}
            />
          </div>
        </div>

        {/* Wave, Kills & Difficulty pill */}
        <div className="flex items-center gap-3 text-xs font-chakra font-bold text-slate-300 bg-slate-950/50 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800/60 w-fit">
          <span className="text-amber-400">{t(language, 'hud.wave')} {engine.wave}</span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-400">{engine.kills} {t(language, 'hud.kills')}</span>
          <span className="text-slate-600">|</span>
          <span className={`font-mono ${getDifficultyColor()}`}>
            {getDifficultyIcon()} {getDifficultyLabel()} {difficulty.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Top Center: Score & Combo Streak */}
      <div className="flex flex-col items-center">
        <div className="bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md px-5 py-1.5 rounded-2xl shadow-xl flex flex-col items-center">
          <span className="text-[10px] font-chakra tracking-widest text-cyan-400 uppercase font-semibold">
            {t(language, 'hud.totalScore')}
          </span>
          <span className="text-2xl sm:text-3xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-300 tracking-wider">
            {engine.score.toLocaleString()}
          </span>
        </div>

        {/* Dynamic Combo Multiplier Badge */}
        {combo > 1 && (
          <div className="mt-2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-orbitron font-extrabold text-rose-300 text-xs sm:text-sm tracking-wider">
              {combo}x {t(language, 'hud.combo')}
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Time Survived & Controls */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end bg-slate-950/70 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl font-mono text-xs text-slate-300">
          <span className="text-[10px] text-slate-500 uppercase font-chakra font-bold">{t(language, 'hud.survivalTime')}</span>
          <span>
            {Math.floor(engine.timeSurvived / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(engine.timeSurvived % 60)
              .toString()
              .padStart(2, '0')}
          </span>
        </div>

        {/* Sound toggle button */}
        <button
          type="button"
          aria-label={isMuted ? t(language, 'hud.aria.unmute') : t(language, 'hud.aria.mute')}
          className="pointer-events-auto p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 active:scale-95 transition backdrop-blur-md shadow-lg"
          onClick={onToggleMute}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Pause toggle button */}
        <button
          type="button"
          aria-label={engine.isPaused ? t(language, 'hud.aria.resume') : t(language, 'hud.aria.pause')}
          className="pointer-events-auto p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 active:scale-95 transition backdrop-blur-md shadow-lg"
          onClick={onTogglePause}
        >
          {engine.isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
