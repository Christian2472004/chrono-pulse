import React from 'react';
import { Play, Trophy, HelpCircle, Volume2, VolumeX, Sparkles, Shield, Zap } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { GameLogo } from './GameLogo';
import { t, Language } from '../i18n';

interface StartScreenProps {
  onStart: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  topScore?: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenLeaderboard,
  onOpenHowToPlay,
  isMuted,
  onToggleMute,
  topScore = 0,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex overflow-y-auto select-none bg-slate-950/70 backdrop-blur-sm">
      {/* Background Animated Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative m-auto max-w-md w-full flex flex-col items-center text-center space-y-4 sm:space-y-5 p-4">
        {/* Animated Neon Logo */}
        <GameLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_22px_rgba(34,211,238,0.3)]" />

        {/* Game Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-chakra tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          {t(language, 'start.badge')}
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-rose-400 drop-shadow-[0_5px_15px_rgba(6,182,212,0.4)]">
            CHRONO<span className="text-cyan-400"> // </span>PULSE
          </h1>
          <p className="font-chakra text-slate-300 text-sm sm:text-base mt-2 tracking-wide font-medium">
            {t(language, 'start.subtitle')}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 w-full font-chakra text-xs">
          <div className="bg-slate-900/80 border border-cyan-500/30 p-2.5 rounded-2xl flex flex-col items-center gap-1 shadow-md">
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-slate-200">{t(language, 'start.feature.slash')}</span>
            <span className="text-[10px] text-slate-400">{t(language, 'start.feature.slash.key')}</span>
          </div>

          <div className="bg-slate-900/80 border border-cyan-500/30 p-2.5 rounded-2xl flex flex-col items-center gap-1 shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">{t(language, 'start.feature.slowmo')}</span>
            <span className="text-[10px] text-slate-400">{t(language, 'start.feature.slowmo.key')}</span>
          </div>

          <div className="bg-slate-900/80 border border-cyan-500/30 p-2.5 rounded-2xl flex flex-col items-center gap-1 shadow-md">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-200">{t(language, 'start.feature.dash')}</span>
            <span className="text-[10px] text-slate-400">{t(language, 'start.feature.dash.key')}</span>
          </div>
        </div>

        {/* High Score Preview */}
        {topScore > 0 && (
          <div className="text-xs font-chakra font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-4 py-1.5 rounded-full shadow-md flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            {t(language, 'start.localBest', { score: topScore.toLocaleString() })}
          </div>
        )}

        {/* Language Selector */}
        <div className="w-full flex justify-center">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={onLanguageChange}
            showLabel={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 font-chakra">
          {/* Start Combat */}
          <button
            type="button"
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black tracking-widest text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/40 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            {t(language, 'start.button.start')}
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              {t(language, 'start.button.howToPlay')}
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {t(language, 'start.button.highScores')}
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  {t(language, 'start.button.unmute')}
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  {t(language, 'start.button.audioOn')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Quick Hint */}
        <p className="text-[11px] text-slate-400 font-mono hidden sm:block" dangerouslySetInnerHTML={{ __html: t(language, 'start.proTip') }} />
      </div>
    </div>
  );
};
