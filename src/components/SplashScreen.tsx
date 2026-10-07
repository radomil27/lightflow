import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number; // Standard: 3800ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 3800,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Timer für den Übergang: Kurz vor Ende Fade-Out starten
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, durationMs - 500);

    // Endgültiges Ausblenden nach voller Dauer
    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  // Tap / Klick auf den Bildschirm überspringt das Intro sofort
  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFAFA] select-none cursor-pointer transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Lightflow Startbildschirm – Tippen zum Überspringen"
    >
      {/* Sanfter, diffuser Ambient-Glow im Hintergrund */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-sky-200/40 via-amber-100/30 to-amber-200/50 blur-3xl pointer-events-none animate-pulse" />

      {/* Zentriertes Brand-Icon mit animierten Ebenen */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        
        {/* Weicher kreisrunder / squircle Lichtschein */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-amber-200/30 via-white to-sky-100/40 blur-xl" />

        {/* 1. Die goldene Flamme (Oben): Pulsierend mit warmem Glanz */}
        <div className="absolute inset-0 flex items-center justify-center animate-flame-glow z-20">
          <img
            src="/splash-flame.png"
            alt="Goldene Lichtflamme"
            className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(245,158,11,0.5)]"
          />
        </div>

        {/* 2. Die blaue Welle (Unten): Kontinuierlich fließendes, undulierendes Wasser */}
        <div className="absolute inset-0 flex items-center justify-center animate-wave-flow z-30">
          <img
            src="/splash-wave.png"
            alt="Fließendes Wasser"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(14,165,233,0.45)]"
          />
        </div>
      </div>

      {/* Marken-Schriftzug */}
      <div className="mt-6 flex flex-col items-center space-y-2 z-30">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] text-[#1E293B] pl-2">
          LIGHTFLOW
        </h1>
        <p className="text-[11px] sm:text-xs font-sans tracking-[0.18em] uppercase text-stone-600 font-medium">
          Angeschlossen an die Quelle
        </p>
      </div>

      {/* Dezent gestalteter Hinweis zum Überspringen */}
      <div className="absolute bottom-10 text-[10px] sm:text-[11px] tracking-wider text-stone-600 uppercase">
        Tippen zum Starten
      </div>
    </div>
  );
};
