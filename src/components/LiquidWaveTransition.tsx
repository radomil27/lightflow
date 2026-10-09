import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { getCircadianTheme, TimeOfDay } from '../services/circadianService';

export interface LiquidOrigin {
  x: number; // Percentage (0-100) or pixel coordinates
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
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [impactCoord, setImpactCoord] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Canvas Ref für High-End physikalisches Refraktions-Rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const actionTimeoutRef = useRef<number | null>(null);

  // Farbschemata abgestimmt auf die Circadian-Stimmung
  const getThemePalette = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          causticColor: 'rgba(253, 230, 138, 0.45)', // Bernsteingold-Glanz
          deepWater: 'rgba(245, 158, 11, 0.12)',
          ringColor: 'rgba(251, 191, 36, 0.65)',
          crestGlow: 'rgba(254, 243, 199, 0.75)',
          bubbleColor: 'rgba(254, 240, 138, 0.5)',
        };
      case 'evening':
        return {
          causticColor: 'rgba(224, 159, 62, 0.35)', // Warme Dämmerung auf Obsidian
          deepWater: 'rgba(15, 23, 42, 0.25)',
          ringColor: 'rgba(217, 119, 6, 0.55)',
          crestGlow: 'rgba(253, 230, 138, 0.5)',
          bubbleColor: 'rgba(224, 159, 62, 0.4)',
        };
      case 'day':
      default:
        return {
          causticColor: 'rgba(186, 230, 253, 0.55)', // Klares Quellblau
          deepWater: 'rgba(14, 165, 233, 0.14)',
          ringColor: 'rgba(56, 189, 248, 0.7)',
          crestGlow: 'rgba(255, 255, 255, 0.85)',
          bubbleColor: 'rgba(224, 242, 254, 0.6)',
        };
    }
  };

  const palette = getThemePalette();

  const triggerTransition = useCallback((action: () => void, clickOrigin?: LiquidOrigin) => {
    // Circadiane Stimmung synchronisieren
    const currentTheme = getCircadianTheme();
    setTimeOfDay(currentTheme.timeOfDay);

    const x = clickOrigin ? clickOrigin.x : 50;
    const y = clickOrigin ? clickOrigin.y : 50;
    setImpactCoord({ x, y });
    setIsTransitioning(true);

    startTimeRef.current = performance.now();

    // Bei T = 450ms (wenn die ersten Wellenringe die Umgebung erfassen):
    // Den Ansichtswechsel bzw. das Öffnen des Modals ausführen
    if (actionTimeoutRef.current) {
      window.clearTimeout(actionTimeoutRef.current);
    }

    actionTimeoutRef.current = window.setTimeout(() => {
      try {
        action();
      } catch (err) {
        console.error('Fehler bei LiquidTransition action():', err);
      }
    }, 450);

  }, []);

  // 60fps Ultra-HD Wasseroberflächen-Canvas Shader & Refraktions-Simulation
  useEffect(() => {
    if (!isTransitioning) return;

    let canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / High-DPI Skalierung für gestochen scharfe Ultra-HD Kaustik
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const impactPxX = (impactCoord.x / 100) * width;
    const impactPxY = (impactCoord.y / 100) * height;

    const DURATION = 3200; // Gesamte Abklingdauer: 3.2 Sekunden

    const render = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Sanfte Ausklingkurve (physikalische Dämpfung der Oberflächenspannung)
      const dampening = Math.pow(1 - progress, 1.8);

      ctx.clearRect(0, 0, width, height);

      if (progress < 1) {
        // 1. ZENTRALER EINSCHLAG-TROPFEN & SPÜL-PULSE
        // Der Fokuspunkt selbst bleibt absolut scharf (wird im Canvas freigehalten)
        const centerDistance = 45; // Pixel-Radius des geschützten Zentrums

        // 2. ZEICHNE DIE ULTRA-HD WELLENRINGE (Wasserkaustik & Lichtbrechung)
        // Geschwindigkeit: Wellenausbreitung c = ~650 px/s
        const waveSpeed = 650;
        const currentDistance = (elapsed / 1000) * waveSpeed;

        const ringCount = 7;
        for (let i = 0; i < ringCount; i++) {
          const ringDist = currentDistance - i * 65;
          if (ringDist > centerDistance && ringDist < 2400) {
            // Wellenamplitude nimmt mit Entfernung 1/sqrt(r) und Zeit ab
            const amp = Math.max(0, (1 - ringDist / 2200) * dampening);
            if (amp <= 0.01) continue;

            const ringWidth = 28 + i * 8;

            ctx.save();
            ctx.beginPath();
            ctx.arc(impactPxX, impactPxY, ringDist, 0, Math.PI * 2);

            // Lichtkante auf dem Wellenberg (Lichtbrechung nach oben)
            const gradient = ctx.createRadialGradient(
              impactPxX,
              impactPxY,
              Math.max(0, ringDist - ringWidth / 2),
              impactPxX,
              impactPxY,
              ringDist + ringWidth / 2
            );

            // Dreidimensionaler Wellenberg:
            // Wellental (dunkler/tief) -> Wellenberg (strahlende Lichtbrechung) -> Wellental
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.3, palette.deepWater);
            gradient.addColorStop(0.5, palette.crestGlow.replace('0.85', (0.55 * amp).toFixed(3)));
            gradient.addColorStop(0.7, palette.ringColor.replace('0.7', (0.45 * amp).toFixed(3)));
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = ringWidth;
            ctx.shadowColor = palette.causticColor;
            ctx.shadowBlur = 12 * amp;
            ctx.stroke();
            ctx.restore();
          }
        }

        // 3. FEINE KREUZ-KAPPILLARE & WASSER-KAUSTIK (Sonnenlicht auf Gewässergrund)
        if (progress > 0.05 && progress < 0.85) {
          const causticAmp = dampening * 0.35;
          ctx.save();
          ctx.globalAlpha = causticAmp;
          ctx.fillStyle = palette.causticColor;

          // Mikro-Lichtreflexe, die sich auf den Wellen brechen
          const causticRings = 4;
          for (let c = 1; c <= causticRings; c++) {
            const cRadius = (currentDistance * 0.75 + c * 80) % (Math.max(width, height) * 0.9);
            if (cRadius > centerDistance) {
              ctx.beginPath();
              ctx.arc(impactPxX, impactPxY, cRadius, 0, Math.PI * 2);
              ctx.strokeStyle = palette.crestGlow.replace('0.85', (0.25 * causticAmp).toFixed(2));
              ctx.lineWidth = 2.5;
              ctx.setLineDash([12, 28, 8, 36]);
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // 4. SANFTE WOGUNG DES GESAMTEN HINTERGRUNDS (Displacement-Effekt)
        // Animiert den SVG-Turbulence-Filter im DOM
        const svgDisp = document.getElementById('water-refraction-displacement') as any;
        if (svgDisp) {
          // Wellenamplitude schwingt an und klingt organisch ab
          const scale = Math.sin(progress * Math.PI) * 14 * dampening;
          svgDisp.setAttribute('scale', scale.toFixed(2));
        }

        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Wasser ist vollkommen zur Ruhe gekommen
        const svgDisp = document.getElementById('water-refraction-displacement') as any;
        if (svgDisp) {
          svgDisp.setAttribute('scale', '0');
        }
        setIsTransitioning(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isTransitioning, impactCoord, palette]);

  return (
    <LiquidTransitionContext.Provider value={{ triggerTransition, isTransitioning }}>
      {/* 
        SVG FE-TURBULENCE & DISPLACEMENT-MAP FILTER
        Dieser physikalische Shader bricht das Licht der darunterliegenden Benutzeroberfläche
        wie echtes Wasser mit Brechungsindex n=1.333
      */}
      <svg className="hidden pointer-events-none" width="0" height="0">
        <defs>
          <filter id="ultra-hd-water-refraction" x="-10%" y="-10%" width="120%" height="120%">
            {/* Feine konzentrische Wellenturbulenz */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.024"
              numOctaves="3"
              result="waterNoise"
            />
            {/* Optische Lichtbrechung / Displacement auf das DOM */}
            <feDisplacementMap
              id="water-refraction-displacement"
              in="SourceGraphic"
              in2="waterNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="refractedOutput"
            />
          </filter>
        </defs>
      </svg>

      {/* 
        DOM Wrapper: Erhält bei laufender Wassertransition den Refraktionsfilter,
        während der direkte Klickfokus durch die Canvas-Geometrie freigehalten wird
      */}
      <div
        id="lightflow-water-surface"
        className="w-full min-h-screen relative"
        style={{
          filter: isTransitioning ? 'url(#ultra-hd-water-refraction)' : 'none',
          willChange: isTransitioning ? 'filter' : 'auto',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {children}
      </div>

      {/* 
        Ultra-HD Photorealistischer Wasseroberflächen-Canvas
        Rendert die physikalischen Wellenberge, Lichtbrechungen & Kaustiken im Overlay
      */}
      {isTransitioning && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            mixBlendMode: 'screen',
            willChange: 'transform',
          }}
          aria-hidden="true"
        />
      )}

      {/* 
        Zentraler physikalischer Einschlagskern (Drop Ripple) an der Koordinate (x, y)
        Erzeugt einen subtilen, hochauflösenden Tropfen-Ring, während das Element scharf bleibt
      */}
      {isTransitioning && (
        <div
          className="fixed pointer-events-none z-[10000]"
          style={{
            left: `${impactCoord.x}%`,
            top: `${impactCoord.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        >
          {/* Kleiner feiner Wassertropfen-Impuls */}
          <div
            className="w-12 h-12 rounded-full border border-white/60 animate-ping opacity-60"
            style={{
              borderColor: palette.crestGlow,
              animationDuration: '1.2s',
            }}
          />
        </div>
      )}
    </LiquidTransitionContext.Provider>
  );
};
