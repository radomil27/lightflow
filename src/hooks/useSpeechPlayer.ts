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
 * Teilt Text an Absätzen und Satzenden (. ! ? : ;) in natürliche Sinneinheiten auf,
 * damit zwischen den Sätzen spürbare, ruhige Atempause entstehen.
 */
function splitTextIntoSentences(text: string): string[] {
  if (!text) return [];

  // Bereinige Markdown-Reste wie **fett**, # Überschriften, Listenstriche
  const clean = text
    .replace(/[*#_`~>]/g, '')
    .replace(/\r\n/g, '\n')
    .trim();

  if (!clean) return [];

  // Teile zunächst an Zeilenumbrüchen (Absätze)
  const paragraphs = clean.split(/\n+/);
  const units: string[] = [];

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Regex für Satzenden inkl. Doppelpunkt und Semikolon für andächtigen Sprachfluss
    const sentenceRegex = /[^.!?:]+[.!?:]+(\s+|$)|[^.!?:]+$/g;
    const matches = trimmedPara.match(sentenceRegex);

    if (matches) {
      for (const m of matches) {
        const sentence = m.trim();
        if (sentence.length > 0) {
          units.push(sentence);
        }
      }
    } else {
      units.push(trimmedPara);
    }
  }

  return units;
}

export function useSpeechPlayer(): UseSpeechPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayingStep, setCurrentPlayingStep] = useState<number | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Queue von Chunks: Jeder Eintrag hat den vorzulesenden Text und den zugehörigen Posten (1-7)
  const queueRef = useRef<{ text: string; step: number; isHeader?: boolean }[]>([]);
  const currentIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const breathTimeoutRef = useRef<any>(null);

  // Wähle die beste deutsche Stimme aus dem System (iOS Siri/Anna/Helena/Enhanced, Android Google/Natural)
  const pickGermanVoice = useCallback(() => {
    if (!isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    // Priorität: Deutsche Stimmen (de-DE, de-CH, de-AT)
    const germanVoices = voices.filter(
      (v) => v.lang.startsWith('de') || v.lang.startsWith('de-')
    );

    if (germanVoices.length === 0) return;

    // Bewertungs-Score für höchste Natürlichkeit:
    // Höchste Punkte für Premium / Enhanced / Siri / bekannte hochwertige deutsche Stimmen
    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      let score = 0;
      const name = v.name.toLowerCase();

      // iOS & macOS Premium/Enhanced Stimmen
      if (name.includes('enhanced') || name.includes('premium')) score += 30;
      if (name.includes('siri')) score += 25;
      if (name.includes('anna') || name.includes('helena') || name.includes('katja') || name.includes('martin')) score += 20;

      // Google Natural & Google Stimmen (Android / Chrome)
      if (name.includes('natural')) score += 22;
      if (name.includes('google')) score += 15;

      // Standard de-DE bevorzugen
      if (v.lang === 'de-DE') score += 5;

      // Lokale Stimmen (kein Netzwerk-Delay) bevorzugen
      if (v.localService) score += 3;

      // Unliebsame monotone Stimmen de-priorisieren
      if (name.includes('compact') || name.includes('robotic')) score -= 15;

      return score;
    };

    const sorted = [...germanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    selectedVoiceRef.current = sorted[0];
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;
    pickGermanVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickGermanVoice;
    }

    // Unmount Cleanup: Sofort stoppen & Timeout leeren
    return () => {
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported, pickGermanVoice]);

  // Spielt den nächsten Chunk aus der Queue mit natürlicher Atempause (350-450ms)
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
    utterance.lang = selectedVoiceRef.current?.lang || 'de-DE';
    
    // Getragenes Andachtstempo: Ruhig, bedacht & warm
    utterance.rate = 0.90;
    utterance.pitch = 0.98;

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onend = () => {
      currentIndexRef.current += 1;
      // Natürliche Sinn- und Atempause: Nach Überschrift 500ms, nach Sätzen 380ms
      const pauseDuration = item.isHeader ? 500 : 380;
      breathTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          speakNextChunk();
        }
      }, pauseDuration);
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

  // Stoppt alle laufenden Sprachausgaben & Timer
  const stopSpeech = useCallback(() => {
    if (!isSupported) return;
    if (breathTimeoutRef.current) {
      clearTimeout(breathTimeoutRef.current);
      breathTimeoutRef.current = null;
    }
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
        { text: `${title}.`, step: stepNum, isHeader: true },
        ...sentenceChunks.map((chunk) => ({ text: chunk, step: stepNum, isHeader: false })),
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

      const fullQueue: { text: string; step: number; isHeader?: boolean }[] = [];

      for (const s of sections) {
        if (!s.text.trim()) continue;
        fullQueue.push({ text: `${s.title}.`, step: s.step, isHeader: true });
        const chunks = splitTextIntoSentences(s.text);
        for (const c of chunks) {
          fullQueue.push({ text: c, step: s.step, isHeader: false });
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
