import { useState, useEffect, useRef, useCallback } from 'react';
import { LightflowReport } from '../types';

export interface UseSpeechPlayerResult {
  isPlaying: boolean;
  isPaused: boolean;
  currentPlayingStep: number | null; // 1-7, oder null wenn inaktiv
  playSection: (stepNum: number, title: string, text: string) => void;
  playFullReport: (report: LightflowReport) => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;
  isSupported: boolean;
}

/**
 * Teilt Text an Satzgrenzen in handliche Chunks (140-200 Zeichen) auf,
 * um den bekannten Mobile-Browser-Bug (Abbruch nach 15s) zu umgehen.
 */
function splitTextIntoSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  // Matcht Sätze anhand von Satzzeichen (. ! ?)
  const regex = /[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g;
  const matches = clean.match(regex);
  if (!matches) return [clean];

  const chunks: string[] = [];
  let currentChunk = '';

  for (const part of matches) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length < 180) {
      currentChunk += (currentChunk ? ' ' : '') + trimmed;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = trimmed;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function useSpeechPlayer(): UseSpeechPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayingStep, setCurrentPlayingStep] = useState<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Queue von Chunks: Jeder Eintrag hat den vorzulesenden Text und den zugehörigen Posten (1-7)
  const queueRef = useRef<{ text: string; step: number }[]>([]);
  const currentIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Wähle die beste deutsche Stimme aus dem System
  const pickGermanVoice = useCallback(() => {
    if (!isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    // Priorität: Deutsche Stimmen, bevorzugt natürliche/hochwertige
    const germanVoices = voices.filter((v) => v.lang.startsWith('de'));
    if (germanVoices.length > 0) {
      const preferred = germanVoices.find((v) =>
        /natural|google|siri|premium|anna|helena|katja|martin/i.test(v.name)
      );
      selectedVoiceRef.current = preferred || germanVoices[0];
    }
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;
    pickGermanVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickGermanVoice;
    }

    // Unmount Cleanup: Sofort stoppen
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported, pickGermanVoice]);

  // Spielt den nächsten Chunk aus der Queue
  const speakNextChunk = useCallback(() => {
    if (!isSupported || !isPlayingRef.current) return;

    if (currentIndexRef.current >= queueRef.current.length) {
      // Vorlesen komplett beendet
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPlayingStep(null);
      return;
    }

    const item = queueRef.current[currentIndexRef.current];
    setCurrentPlayingStep(item.step);

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.94;
    utterance.pitch = 0.98;

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onend = () => {
      currentIndexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = (e) => {
      // Ignoriere gewollte Abbrüche durch cancel()
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('[useSpeechPlayer] Utterance-Fehler:', e.error);
      currentIndexRef.current += 1;
      speakNextChunk();
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  // Stoppt alle laufenden Sprachausgaben
  const stopSpeech = useCallback(() => {
    if (!isSupported) return;
    isPlayingRef.current = false;
    queueRef.current = [];
    currentIndexRef.current = 0;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPlayingStep(null);
  }, [isSupported]);

  // Einzelnen Posten vorlesen
  const playSection = useCallback(
    (stepNum: number, title: string, text: string) => {
      if (!isSupported || !text) return;

      // Wenn genau dieser Posten bereits läuft -> anhalten
      if (isPlayingRef.current && currentPlayingStep === stepNum) {
        stopSpeech();
        return;
      }

      stopSpeech();

      // Erstelle Chunks: Ansage des Titels, dann der Inhalt
      const sentenceChunks = splitTextIntoSentences(text);
      const queue = [
        { text: `${title}.`, step: stepNum },
        ...sentenceChunks.map((chunk) => ({ text: chunk, step: stepNum })),
      ];

      queueRef.current = queue;
      currentIndexRef.current = 0;
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentPlayingStep(stepNum);

      speakNextChunk();
    },
    [isSupported, currentPlayingStep, stopSpeech, speakNextChunk]
  );

  // Gesamten Report sequenziell vorlesen
  const playFullReport = useCallback(
    (report: LightflowReport) => {
      if (!isSupported) return;

      if (isPlayingRef.current) {
        stopSpeech();
        return;
      }

      stopSpeech();

      const sections = [
        { step: 1, title: '1. Lichtfunke', text: report.lichtfunke || report.coreConduit || '' },
        { step: 2, title: '2. Klarblick', text: report.klarblick || report.systemDecoded || '' },
        { step: 3, title: '3. Tagwerk', text: report.tagwerk || report.workBench || '' },
        { step: 4, title: '4. Freiraum', text: report.freiraum || report.dailyFreedom || '' },
        { step: 5, title: '5. Standpunkt', text: report.standpunkt || report.profileSnapshot.relationshipStatus || '' },
        { step: 6, title: '6. Spiegel', text: report.spiegel || '' },
        { step: 7, title: '7. Leuchtkraft, Herzensgebet', text: report.leuchtkraft || report.heartGarden || '' },
      ];

      const fullQueue: { text: string; step: number }[] = [];

      for (const s of sections) {
        if (!s.text.trim()) continue;
        fullQueue.push({ text: `${s.title}.`, step: s.step });
        const chunks = splitTextIntoSentences(s.text);
        for (const c of chunks) {
          fullQueue.push({ text: c, step: s.step });
        }
      }

      if (fullQueue.length === 0) return;

      queueRef.current = fullQueue;
      currentIndexRef.current = 0;
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentPlayingStep(fullQueue[0].step);

      speakNextChunk();
    },
    [isSupported, stopSpeech, speakNextChunk]
  );

  const pauseSpeech = useCallback(() => {
    if (!isSupported || !isPlayingRef.current) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resumeSpeech = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  return {
    isPlaying,
    isPaused,
    currentPlayingStep,
    playSection,
    playFullReport,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    isSupported,
  };
}
