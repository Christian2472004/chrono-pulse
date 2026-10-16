import React from 'react';
import { Globe, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language, t } from '../i18n';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown only when clicking OUTSIDE the component (a mousedown on an
  // option must not close the list before its click event fires)
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-400 text-xs font-chakra font-semibold transition active:scale-95"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        {showLabel && <span>{t(currentLanguage, 'language.select')}</span>}
        <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[10px] font-bold text-cyan-300 tracking-wider">
          {currentLang.code.toUpperCase()}
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-950/80 overflow-hidden z-50 animate-fade-in" role="listbox">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={lang.code === currentLanguage}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                  lang.code === currentLanguage
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className={`w-8 text-center px-1 py-0.5 rounded font-mono text-[10px] font-bold border tracking-wider ${
                  lang.code === currentLanguage
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}>
                  {lang.code.toUpperCase()}
                </span>
                <span className="font-chakra font-medium">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes lang-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: lang-fade-in 0.12s ease-out; }
      `}</style>
    </div>
  );
};