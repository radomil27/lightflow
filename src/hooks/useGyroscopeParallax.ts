import { useEffect, useRef, useState, useCallback } from 'react';

export interface ParallaxState {
  tiltX: number; // Grad (-15 bis 15)
  tiltY: number; // Grad (-15 bis 15)
  glareX: number; // Prozent (0% bis 100%)
  glareY: number; // Prozent (0% bis 100%)
  isSupported: boolean;
  permissionGranted: boolean;
}

/**
 * useGyroscopeParallax Hook
 * 
 * Bietet 60fps hardwarebeschleunigte Gyroskop- & Maus-Parallax:
 * - iOS DeviceOrientationEvent.requestPermission() Support
 * - Glättung (LERP - Linear Interpolation) für samtweichen Lichteinfall
 * - Bereitstellung direkter CSS-Variablen:
 *   --tilt-x, --tilt-y, --glare-x, --glare-y, --glare-opacity
 * - Automatischer Maus-Hover Fallback für Desktop
 */
export function useGyroscopeParallax(containerRef: React.RefObject<HTMLElement | null>) {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  // Zielwerte vs. aktuelle geglättete Werte für 60fps LERP
  const targetX = useRef<number>(0);
  const targetY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Erkenne Touch / Mobile
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setIsMobileDevice(isTouch);
  }, []);

  // iOS Permission Handler
  const requestOrientationPermission = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } catch (err) {
        console.warn('Gyroskop-Berechtigung verweigert oder abgebrochen:', err);
      }
      return false;
    } else {
      // Standard Android / Desktop oder Browser ohne Permission-Zwang
      setPermissionGranted(true);
      return true;
    }
  }, []);

  // 60fps Animationsschleife mit LERP (Linear Interpolation)
  useEffect(() => {
    const loop = () => {
      // Dämpfungsfaktor (0.1 = butterweich & verzögerungsfrei)
      const lerpFactor = 0.12;
      currentX.current += (targetX.current - currentX.current) * lerpFactor;
      currentY.current += (targetY.current - currentY.current) * lerpFactor;

      const tiltX = currentX.current;
      const tiltY = currentY.current;

      // Berechne Glare-Position (Lichteinfall) von 0% bis 100%
      // Wenn das Gerät nach rechts geneigt wird, wandert das Licht nach links (physikalische Reflexion)
      const glareX = 50 + tiltX * 2.5; // 50% Zentrum +/-
      const glareY = 40 + tiltY * 2.5;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        containerRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        containerRef.current.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
        containerRef.current.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [containerRef]);

  // Listener für DeviceOrientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // Gamma: Links/Rechts-Neigung (-90 bis 90) -> normalisiert auf -12 bis 12 Grad
      const rawGamma = Math.max(-45, Math.min(45, e.gamma));
      const normalizedX = (rawGamma / 45) * 12;

      // Beta: Oben/Unten-Neigung (-180 bis 180, typisch gehalten bei 45 Grad)
      // Normalisiere um den natürlichen Lese-Winkel (ca. 45° Neigung)
      const rawBeta = Math.max(0, Math.min(90, e.beta));
      const normalizedY = ((rawBeta - 45) / 45) * 12;

      targetX.current = normalizedX;
      targetY.current = normalizedY;
    };

    // Nur registrieren, wenn entweder freigegeben oder kein iOS-Zwang
    const canListen =
      typeof (DeviceOrientationEvent as any)?.requestPermission !== 'function' ||
      permissionGranted;

    if (canListen && typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [permissionGranted]);

  // Fallback für Desktop: Maus-Bewegung über dem Etui
  useEffect(() => {
    if (isMobileDevice) return; // Auf Mobile wird ausschließlich das Gyroskop verwendet

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalisiere von -1 bis 1
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;

      targetX.current = normalizedX * 8; // Maximal 8 Grad Neigung mit Maus
      targetY.current = normalizedY * 8;
    };

    const handleMouseLeave = () => {
      targetX.current = 0;
      targetY.current = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, isMobileDevice]);

  return {
    permissionGranted,
    requestOrientationPermission,
    isMobileDevice,
  };
}
