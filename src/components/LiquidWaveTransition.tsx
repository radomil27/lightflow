import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { getCircadianTheme, TimeOfDay } from '../services/circadianService';

export interface LiquidOrigin {
  x: number;
  y: number;
}

interface LiquidTransitionContextType {
  triggerTransition: (action: () => void, origin?: LiquidOrigin) => void;
  isTransitioning: boolean;
}

const LiquidTransitionContext = createContext<LiquidTransitionContextType>({
  triggerTransition: (action) => action(),
  isTransitioning: false,
});

export const useLiquidTransition = () => useContext(LiquidTransitionContext);

interface LiquidTransitionProviderProps {
  children: React.ReactNode;
}

export const LiquidTransitionProvider: React.FC<LiquidTransitionProviderProps> = ({ children }) => {
  const [phase, setPhase] = useState<'idle' | 'rising' | 'switching' | 'settling'>('idle');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [origin, setOrigin] = useState<LiquidOrigin>({ x: 50, y: 100 });
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const triggerTransition = useCallback((action: () => void, clickOrigin?: LiquidOrigin) => {
    clearTimers();

    // Circadiane Stimmung synchronisieren
    const currentTheme = getCircadianTheme();
    setTimeOfDay(currentTheme.timeOfDay);

    // Klickursprung (default: unten Mitte)
    if (clickOrigin) {
      setOrigin(clickOrigin);
    } else {
      setOrigin({ x: 50, y: 100 });
    }

    // 1. Welle startet: Aufsteigen (rising)
    setPhase('rising');

    // 2. View/Modal-Wechsel ausführen, wenn die Welle den Screen verhüllt (~600ms)
    const switchTimer = window.setTimeout(() => {
      setPhase('switching');
      try {
        action();
      } catch (err) {
        console.error('Error during liquid transition action:', err);
      }

      // 3. Welle glättet und beruhigt sich über die nächsten 2.4 Sekunden (settling)
      const settleTimer = window.setTimeout(() => {
        setPhase('settling');
      }, 50);
      timersRef.current.push(settleTimer);

      // 4. Nach insgesamt 3.0 Sekunden ist das Wasser vollkommen beruhigt und transparent
      const finishTimer = window.setTimeout(() => {
        setPhase('idle');
      }, 2400);
      timersRef.current.push(finishTimer);

    }, 600);
    timersRef.current.push(switchTimer);

  }, []);

  // Farbschemata abgestimmt auf die Circadian-Stimmung
  const getGradients = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          primary: 'linear-gradient(180deg, rgba(251, 191, 36, 0.94) 0%, rgba(217, 119, 6, 0.96) 60%, rgba(180, 83, 9, 0.98) 100%)',
          secondary: 'linear-gradient(180deg, rgba(253, 230, 138, 0.85) 0%, rgba(245, 158, 11, 0.88) 100%)',
          accent: '#FDE68A',
          foam: 'rgba(254, 243, 199, 0.85)',
          glow: 'rgba(245, 158, 11, 0.45)',
        };
      case 'evening':
        return {
          primary: 'linear-gradient(180deg, rgba(30, 41, 59, 0.96) 0%, rgba(15, 23, 42, 0.98) 60%, rgba(10, 15, 26, 0.99) 100%)',
          secondary: 'linear-gradient(180deg, rgba(180, 83, 9, 0.75) 0%, rgba(15, 23, 42, 0.92) 100%)',
          accent: '#E09F3E',
          foam: 'rgba(224, 159, 62, 0.65)',
          glow: 'rgba(224, 159, 62, 0.3)',
        };
      case 'day':
      default:
        return {
          primary: 'linear-gradient(180deg, rgba(14, 165, 233, 0.94) 0%, rgba(2, 132, 199, 0.96) 50%, rgba(30, 58, 138, 0.98) 100%)',
          secondary: 'linear-gradient(180deg, rgba(56, 189, 248, 0.85) 0%, rgba(14, 165, 233, 0.88) 100%)',
          accent: '#38BDF8',
          foam: 'rgba(224, 242, 254, 0.85)',
          glow: 'rgba(14, 165, 233, 0.45)',
        };
    }
  };

  const gradients = getGradients();
  const isActive = phase !== 'idle';

  return (
    <LiquidTransitionContext.Provider value={{ triggerTransition, isTransitioning: isActive }}>
      {children}

      {/* Flüssiges Wasser-Overlay */}
      {isActive && (
        <div
          className={`fixed inset-0 z-[100] pointer-events-none overflow-hidden transition-opacity duration-1000 ${
            phase === 'settling' ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            willChange: 'transform, opacity',
            perspective: '1000px',
          }}
          aria-hidden="true"
        >
          {/* Organischer Ausbreitungskern (Radial Wave Surge vom Klickpunkt) */}
          <div
            className="absolute rounded-full transition-transform duration-700 ease-out"
            style={{
              left: `${origin.x}%`,
              top: `${origin.y}%`,
              transform: phase === 'rising' ? 'translate(-50%, -50%) scale(25)' : 'translate(-50%, -50%) scale(30)',
              width: '60px',
              height: '60px',
              background: `radial-gradient(circle, ${gradients.glow} 0%, rgba(255,255,255,0) 70%)`,
              opacity: phase === 'settling' ? 0.2 : 0.85,
              transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1800ms ease-out',
            }}
          />

          {/* Haupt-Wellenkörper (Hintergrund-Wasserflut) */}
          <div
            className="absolute inset-0 transition-transform cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              background: gradients.primary,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transform: phase === 'rising' ? 'translate3d(0, 0, 0)' : phase === 'switching' ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
              transitionDuration: phase === 'rising' ? '600ms' : '2200ms',
              transitionTimingFunction: phase === 'rising' ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Organischer SVG Wave Mesh Header mit Sinus-Wellen */}
          <div
            className="absolute left-0 right-0 h-48 sm:h-64 pointer-events-none transition-transform"
            style={{
              top: phase === 'rising' ? '-40px' : '0px',
              transform: phase === 'rising' ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100vh, 0)',
              transitionDuration: phase === 'rising' ? '600ms' : '2400ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sekundäre Tiefenwelle */}
              <path
                className="animate-wave-flow"
                d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,218.7C960,235,1056,245,1152,229.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                fill={gradients.accent}
                fillOpacity="0.45"
              />

              {/* Haupt-Flüssigkeitswelle */}
              <path
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,138.7C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                fill="url(#liquid-wave-grad)"
              />

              {/* Lichtkräuselung / Schaumkante */}
              <path
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,138.7C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128"
                stroke={gradients.foam}
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#wave-glow)"
              />

              <defs>
                <linearGradient id="liquid-wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={gradients.accent} stopOpacity="0.8" />
                  <stop offset="100%" stopColor="rgba(15, 23, 42, 0.95)" stopOpacity="0.95" />
                </linearGradient>
                <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
          </div>

          {/* Aufsteigende Lichtbläschen & Lebenswasser-Partikel */}
          <div className="absolute inset-0 pointer-events-none flex justify-around items-end pb-24 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/40 shadow-lg shadow-white/30"
                style={{
                  animation: `oxygenBubble ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: phase === 'settling' ? 0.1 : 0.6,
                  transition: 'opacity 1500ms ease',
                }}
              />
            ))}
          </div>

          {/* Zentraler spiritueller Licht-Impuls beim Durchfluten */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="text-center transition-all duration-700"
              style={{
                opacity: phase === 'switching' ? 1 : 0,
                transform: phase === 'switching' ? 'scale(1)' : 'scale(0.85)',
              }}
            >
              <div className="font-serif italic text-white/90 text-lg sm:text-2xl drop-shadow-md">
                „Ströme lebendigen Wassers“
              </div>
              <div className="text-[11px] tracking-widest uppercase text-white/70 font-semibold mt-1">
                Lightflow v2.0
              </div>
            </div>
          </div>
        </div>
      )}
    </LiquidTransitionContext.Provider>
  );
};
