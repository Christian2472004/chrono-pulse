import React from 'react';
import { X, ShieldAlert, Sparkles, Zap, Crosshair, Flame } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { t, Language } from '../i18n';

interface HowToPlayModalProps {
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, language, onLanguageChange }) => {
  // Escape closes the dialog (standard modal pattern)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-xl font-orbitron font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
            {t(language, 'howtoplay.title')}
          </h2>
          <button
            type="button"
            aria-label="Close protocols modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-chakra text-slate-300 text-sm">
          {/* Rule 1: Blade Slash */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                1. {t(language, 'howtoplay.slash')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.slash.desc') }} />
            </div>
          </div>

          {/* Rule 2: Chrono Surge */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                2. {t(language, 'howtoplay.chrono')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.chrono.desc') }} />
            </div>
          </div>

          {/* Rule 3: Cyber Dash */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                3. {t(language, 'howtoplay.dash')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.dash.desc') }} />
            </div>
          </div>

          {/* Movement & Aim */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                4. {t(language, 'howtoplay.movement')} / {t(language, 'howtoplay.aim')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.movement.desc') }} />
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.aim.desc') }} />
            </div>
          </div>

          {/* Deflect */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                5. {t(language, 'howtoplay.deflect')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.deflect.desc') }} />
            </div>
          </div>

          {/* Enemies */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                6. {t(language, 'howtoplay.enemies')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">DRONE (rose) / SNIPER (purple) / SPLITTER (amber) / ORB_WEAVER (cyan) / TITAN (red)</p>
            </div>
          </div>

          {/* Pickups */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                7. {t(language, 'howtoplay.pickups')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.pickups.desc') }} />
            </div>
          </div>

          {/* Combo */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-orbitron text-slate-100 text-xs sm:text-sm">
                8. {t(language, 'howtoplay.combo')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: t(language, 'howtoplay.combo.desc') }} />
            </div>
          </div>

          {/* Pro Tips */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
            <h4 className="font-orbitron font-bold text-xs text-cyan-400 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4" />
              {t(language, 'howtoplay.tips')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex gap-2">• {t(language, 'howtoplay.tip1')}</li>
              <li className="flex gap-2">• {t(language, 'howtoplay.tip2')}</li>
              <li className="flex gap-2">• {t(language, 'howtoplay.tip3')}</li>
              <li className="flex gap-2">• {t(language, 'howtoplay.tip4')}</li>
            </ul>
          </div>

          {/* Language Selector */}
          <div className="pt-2 flex justify-center">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
              showLabel={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-chakra font-black tracking-wider text-xs hover:opacity-90 active:scale-95 transition shadow-lg shadow-cyan-500/30"
          >
            {t(language, 'howtoplay.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
