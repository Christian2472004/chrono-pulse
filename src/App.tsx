import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { HighScoreRecord, GameState } from './game/types';
import { audio } from './game/audio';
import { StartScreen } from './components/StartScreen';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Language, SUPPORTED_LANGUAGES } from './i18n';

const HIGH_SCORE_KEY = 'chrono_pulse_high_scores_v1';
const LANGUAGE_KEY = 'chrono_pulse_language_v1';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('START');
  const [isMuted, setIsMuted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const [lastRecord, setLastRecord] = useState<HighScoreRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [highScores, setHighScores] = useState<HighScoreRecord[]>([]);

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) {
        return stored as Language;
      }
    } catch { }
    // Default to browser language if supported, else English
    const browserLang = navigator.language.split('-')[0] as Language;
    return SUPPORTED_LANGUAGES.some(l => l.code === browserLang) ? browserLang : 'en';
  });

  // Force re-render state periodically for HUD metrics
  const [, setTick] = useState(0);

  // Track whether any modal is open so global shortcuts don't fight modal interactions
  const modalOpenRef = useRef(false);
  modalOpenRef.current = showLeaderboard || showHowToPlay;

  // Save language preference
  const saveLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch { }
  }, []);

  // Keep the document lang attribute in sync (screen readers, hyphenation, fonts)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY);
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch {
      // Local storage disabled or error
    }

    // Touch device detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const handleGameOver = useCallback((record: HighScoreRecord) => {
    setLastRecord(record);
    setGameState('GAMEOVER');

    setHighScores((prev) => {
      const isTop = prev.length === 0 || record.score > (prev[0]?.score || 0);
      setIsNewRecord(isTop);

      const updated = [...prev, record].sort((a, b) => b.score - a.score).slice(0, 10);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const handleStateChange = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const saveHighScores = useCallback((records: HighScoreRecord[]) => {
    setHighScores(records);
    try {
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(records));
    } catch {
      // Ignore
    }
  }, []);

  // Initialize engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      handleStateChange,
      handleGameOver
    );
    engineRef.current = engine;

    // Window resize handler
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === 'KeyP' || e.code === 'Escape') {
        // When a modal is open, let the modal handle Escape (close) instead
        if (modalOpenRef.current) return;
        if (engine.isRunning && !engine.isGameOver) {
          if (engine.isPaused) {
            engine.resume();
            setGameState('PLAYING');
          } else {
            engine.pause();
            setGameState('PAUSED');
          }
          return;
        }
      }

      if (e.code === 'KeyM') {
        toggleMute();
        return;
      }

      if (engine.isRunning && !engine.isPaused && !engine.isGameOver) {
        engine.handleKeyDown(e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (engine.isRunning && !engine.isPaused && !engine.isGameOver) {
        engine.handleKeyUp(e.code);
      }
    };

    // Pointer movement for mouse aim
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        engine.mouseX = e.clientX - rect.left;
        engine.mouseY = e.clientY - rect.top;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && engine.isRunning && !engine.isPaused && !engine.isGameOver) {
        engine.isPointerDown = true;
        engine.performSlash();
      }
    };

    const handleMouseUp = () => {
      engine.isPointerDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Regular interval to sync HUD (e.g. 15fps sync for UI elements)
    const hudInterval = setInterval(() => {
      if (engineRef.current?.isRunning) {
        setTick((t) => (t + 1) % 1000);
      }
    }, 66);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(hudInterval);
      engine.destroy();
    };
  }, [handleGameOver, handleStateChange]);

  const startGame = () => {
    audio.init();
    if (engineRef.current) {
      engineRef.current.start();
      setGameState('PLAYING');
    }
  };

  const restartGame = () => {
    if (engineRef.current) {
      engineRef.current.start();
      setGameState('PLAYING');
    }
  };

  const resumeGame = () => {
    if (engineRef.current) {
      engineRef.current.resume();
      setGameState('PLAYING');
    }
  };

  const togglePause = () => {
    if (!engineRef.current) return;
    if (engineRef.current.isPaused) {
      engineRef.current.resume();
      setGameState('PLAYING');
    } else {
      engineRef.current.pause();
      setGameState('PAUSED');
    }
  };

  const goToMainMenu = () => {
    if (engineRef.current) {
      engineRef.current.pause();
      engineRef.current.destroy();
      engineRef.current = null; // <-- important : réinitialise la référence
    }
    setGameState('START');
    setLastRecord(null);
    setIsNewRecord(false);
  };

  const toggleMute = () => {
    audio.init();
    const next = !isMuted;
    setIsMuted(next);
    audio.setMuted(next);
  };

  const clearHighScores = () => {
    saveHighScores([]);
  };

  // Language change handler for components
  const handleLanguageChange = useCallback((lang: Language) => {
    saveLanguage(lang);
  }, [saveLanguage]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none crt-overlay">
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      {/* Screen Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none z-10" />

      {/* HUD active during PLAYING or PAUSED */}
      {engineRef.current && (gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <HUD
          engine={engineRef.current}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onTogglePause={togglePause}
          language={language}
        />
      )}

      {/* Touch Screen On-screen Joystick and Buttons on mobile */}
      {isTouchDevice && engineRef.current && gameState === 'PLAYING' && (
        <TouchControls engine={engineRef.current} />
      )}

      {/* Start Screen Overlay */}
      {gameState === 'START' && (
        <StartScreen
          onStart={startGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          topScore={highScores[0]?.score}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {/* Pause Screen Overlay */}
      {gameState === 'PAUSED' && (
        <PauseOverlay
          onResume={resumeGame}
          onRestart={restartGame}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onMainMenu={goToMainMenu}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {/* Game Over Screen Overlay */}
      {gameState === 'GAMEOVER' && lastRecord && (
        <GameOverOverlay
          record={lastRecord}
          isNewBest={isNewRecord}
          onRestart={restartGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onMainMenu={goToMainMenu}
          language={language}
          onLanguageChange={handleLanguageChange}
          shortcutEnabled={!showLeaderboard && !showHowToPlay}
        />
      )}

      {/* Hall of Masters Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          records={highScores}
          onClose={() => setShowLeaderboard(false)}
          onClear={clearHighScores}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {/* How To Play Protocols Modal */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => setShowHowToPlay(false)}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      )}
    </div>
  );
}

export default App;
