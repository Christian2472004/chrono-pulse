import React from 'react';
import { HighScoreRecord } from '../game/types';
import { Trophy, Flame, Clock, Crosshair, X, Trash2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { t, tRank, Language } from '../i18n';

interface LeaderboardModalProps {
  records: HighScoreRecord[];
  onClose: () => void;
  onClear: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  records,
  onClose,
  onClear,
  language,
  onLanguageChange,
}) => {
  // Escape closes the dialog (standard modal pattern)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-orbitron font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400">
              {t(language, 'leaderboard.title')}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close high score modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-chakra">
              <p className="text-base font-semibold">{t(language, 'leaderboard.empty')}</p>
              <p className="text-xs text-slate-400 mt-1">
                Survive the cyber grid and achieve your first high score!
              </p>
            </div>
          ) : (
            records.map((rec, index) => {
              const isFirst = index === 0;
              const isTopThree = index < 3;

              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isFirst
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/40'
                      : isTopThree
                      ? 'bg-slate-900/80 border-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-orbitron font-black text-xs ${
                        index === 0
                          ? 'bg-amber-400 text-slate-950'
                          : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron font-bold text-sm text-slate-100">
                          {rec.score.toLocaleString()} PTS
                        </span>
                        <span className="text-[10px] font-chakra font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                          {tRank(language, rec.rankTitle)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Crosshair className="w-3 h-3 text-rose-400" />
                          {rec.kills} {t(language, 'leaderboard.kills')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {rec.maxCombo}x {t(language, 'leaderboard.combo')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          {rec.timeSurvivedSeconds}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:block">
                    {rec.date}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex justify-between items-center">
          {records.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 transition hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t(language, 'leaderboard.clear')}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
              showLabel={false}
            />
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-chakra font-black tracking-wider text-xs hover:bg-cyan-400 active:scale-95 transition shadow-lg shadow-cyan-500/30"
            >
              {t(language, 'leaderboard.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
