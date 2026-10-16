import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { t, Language } from '../i18n';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHowToPlay: () => void;
  onMainMenu: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  onResume,
  onRestart,
  isMuted,
  onToggleMute,
  onOpenHowToPlay,
  onMainMenu,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl shadow-cyan-950/80 space-y-6">
        <div>
          <span className="text-xs font-chakra font-bold tracking-widest text-cyan-400 uppercase">
            {t(language, 'pause.subtitle')}
          </span>
          <h2 className="text-3xl font-orbitron font-black text-white tracking-wider mt-1">
            {t(language, 'pause.title')}
          </h2>
        </div>

        <div className="flex flex-col gap-3 font-chakra">
          {/* Resume */}
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider text-sm flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {t(language, 'pause.resume')}
          </button>

          {/* Quick Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold tracking-wider text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {t(language, 'pause.restart')}
          </button>

          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 font-semibold tracking-wider text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                {t(language, 'pause.audio.muted')}
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                {t(language, 'pause.audio.active')}
              </>
            )}
          </button>

          {/* Protocols */}
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/80 text-slate-400 hover:text-slate-200 font-semibold tracking-wider text-xs flex items-center justify-center gap-2 transition"
          >
            <HelpCircle className="w-4 h-4" />
            {t(language, 'pause.protocols')}
          </button>

          {/* Main Menu */}
          <button
            type="button"
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/80 text-slate-400 hover:text-slate-200 font-semibold tracking-wider text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {t(language, 'pause.mainMenu')}
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
