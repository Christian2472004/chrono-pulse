import React, { useRef, useState, useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Zap, ShieldAlert, Sparkles } from 'lucide-react';

interface TouchControlsProps {
  engine: GameEngine | null;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine }) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [basePos, setBasePos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  const [isChronoActive, setIsChronoActive] = useState(false);

  // Joystick touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setBasePos({ x: centerX, y: centerY });
    setJoystickActive(true);
    handleJoystickMove(touch.clientX, touch.clientY, centerX, centerY);
  };

  const handleJoystickMove = (clientX: number, clientY: number, bx: number, by: number) => {
    const dx = clientX - bx;
    const dy = clientY - by;
    const dist = Math.hypot(dx, dy);
    const maxDist = 48;

    let clampedX = dx;
    let clampedY = dy;
    if (dist > maxDist) {
      clampedX = (dx / dist) * maxDist;
      clampedY = (dy / dist) * maxDist;
    }

    setStickPos({ x: clampedX, y: clampedY });

    if (engine && dist > 8) {
      engine.touchMoveVec = {
        x: dx / Math.max(dist, 1),
        y: dy / Math.max(dist, 1)
      };
    } else if (engine) {
      engine.touchMoveVec = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchIdRef.current) {
        handleJoystickMove(t.clientX, t.clientY, basePos.x, basePos.y);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setStickPos({ x: 0, y: 0 });
        if (engine) engine.touchMoveVec = null;
        break;
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (engine) engine.touchMoveVec = null;
    };
  }, [engine]);

  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none z-30 select-none pb-safe">
      {/* Left: Virtual Movement Joystick */}
      <div
        className={`pointer-events-auto relative w-32 h-32 rounded-full border-2 bg-slate-950/60 backdrop-blur-md flex items-center justify-center touch-none transition-colors duration-150 ${
          joystickActive ? 'border-cyan-400 bg-slate-900/80 shadow-cyan-500/50 shadow-lg' : 'border-cyan-500/40 shadow-cyan-950/40 shadow-md'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-300 border-2 border-white/80 shadow-md shadow-cyan-500/50 flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>
        <span className="absolute bottom-2 text-[9px] font-chakra font-bold tracking-widest text-cyan-400/70 uppercase">
          MOVE
        </span>
      </div>

      {/* Right: Action Buttons (Slash, Chrono Surge, Dash) */}
      <div className="pointer-events-auto flex flex-col items-end gap-3 select-none">
        <div className="flex gap-2">
          {/* Dash Button */}
          <button
            type="button"
            className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/60 backdrop-blur-md text-amber-300 flex flex-col items-center justify-center active:scale-90 active:bg-amber-400/40 transition shadow-md shadow-amber-950/30"
            onTouchStart={(e) => {
              e.preventDefault();
              engine?.performDash();
            }}
            onClick={() => engine?.performDash()}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[8px] font-chakra font-bold">DASH</span>
          </button>

          {/* Chrono Surge Hold Button */}
          <button
            type="button"
            className={`w-14 h-14 rounded-2xl border backdrop-blur-md flex flex-col items-center justify-center active:scale-95 transition shadow-md ${
              isChronoActive
                ? 'bg-cyan-500 border-white text-slate-950 shadow-cyan-400/70 scale-95'
                : 'bg-cyan-950/60 border-cyan-400/60 text-cyan-300 shadow-cyan-950/30'
            }`}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsChronoActive(true);
              engine?.setChronoSurge(true);
            }}
            onTouchEnd={() => {
              setIsChronoActive(false);
              engine?.setChronoSurge(false);
            }}
            onTouchCancel={() => {
              setIsChronoActive(false);
              engine?.setChronoSurge(false);
            }}
            onMouseDown={() => {
              setIsChronoActive(true);
              engine?.setChronoSurge(true);
            }}
            onMouseUp={() => {
              setIsChronoActive(false);
              engine?.setChronoSurge(false);
            }}
          >
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="text-[8px] font-chakra font-bold">SLOW-MO</span>
          </button>
        </div>

        {/* Primary Slash Button */}
        <button
          type="button"
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border-2 border-rose-300 text-white shadow-xl shadow-rose-600/50 flex flex-col items-center justify-center active:scale-90 active:from-rose-500 active:to-pink-400 transition"
          onTouchStart={(e) => {
            e.preventDefault();
            engine?.performSlash();
          }}
          onClick={() => engine?.performSlash()}
        >
          <ShieldAlert className="w-7 h-7" />
          <span className="text-[10px] font-chakra font-black tracking-wider">SLASH</span>
        </button>
      </div>
    </div>
  );
};
