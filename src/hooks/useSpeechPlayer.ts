import { useState, useEffect, useRef, useCallback } from 'react';
import { LightflowReport, AppSettings } from '../types';
import { fetchOpenAiTts, fetchGoogleTts } from '../services/ttsService';

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

export function useSpeechPlayer(settings?: AppSettings): UseSpeechPlayerResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayingStep, setCurrentPlayingStep] = useState<number | null>(null);

  // Audio-Element für Cloud-TTS (OpenAI / Google Cloud Audio-Stream)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Basis-Verfügbarkeit: Sprachausgabe ist aktiv, wenn der User sie aktiviert hat und ein API-Key da ist
  // ODER WebSpeech verfügbar ist (wird aber im Report durch isSpeechEnabled gesteuert)
  const isWebSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isCloudTts = Boolean(
    settings?.speechEnabled &&
    settings?.speechApiKey &&
    settings.speechApiKey.trim().length > 0
  );
  const isSupported = isCloudTts || isWebSpeechAvailable;

  // Queue von Chunks: Jeder Eintrag hat den vorzulesenden Text und den zugehörigen Posten (1-7)
  const queueRef = useRef<{ text: string; step: number; isHeader?: boolean }[]>([]);
  const currentIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const breathTimeoutRef = useRef<any>(null);

  // Wähle die beste deutsche Stimme aus dem System (iOS Siri/Anna/Helena/Enhanced, Android Google/Natural)
  const pickGermanVoice = useCallback(() => {
    if (!isWebSpeechAvailable) return;
    const voices = window.speechSynthesis.getVoices();
    const germanVoices = voices.filter(
      (v) => v.lang.startsWith('de') || v.lang.startsWith('de-')
    );

    if (germanVoices.length === 0) return;

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      let score = 0;
      const name = v.name.toLowerCase();

      if (name.includes('enhanced') || name.includes('premium')) score += 30;
      if (name.includes('siri')) score += 25;
      if (name.includes('anna') || name.includes('helena') || name.includes('katja') || name.includes('martin')) score += 20;
      if (name.includes('natural')) score += 22;
      if (name.includes('google')) score += 15;
      if (v.lang === 'de-DE') score += 5;
      if (v.localService) score += 3;
      if (name.includes('compact') || name.includes('robotic')) score -= 15;

      return score;
    };

    const sorted = [...germanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    selectedVoiceRef.current = sorted[0];
  }, [isWebSpeechAvailable]);

  useEffect(() => {
    if (!isWebSpeechAvailable) return;
    pickGermanVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickGermanVoice;
    }

    return () => {
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isWebSpeechAvailable, pickGermanVoice]);

  // Stoppt alle laufenden Sprachausgaben & Timer
  const stopSpeech = useCallback(() => {
    if (breathTimeoutRef.current) {
      clearTimeout(breathTimeoutRef.current);
      breathTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (isWebSpeechAvailable) {
      window.speechSynthesis.cancel();
    }
    isPlayingRef.current = false;
    queueRef.current = [];
    currentIndexRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPlayingStep(null);
  }, [isWebSpeechAvailable]);

  // Spielt den nächsten Chunk per lokaler WebSpeech API ab
  const speakNextWebChunk = useCallback(() => {
    if (!isWebSpeechAvailable || !isPlayingRef.current) return;

    if (currentIndexRef.current >= queueRef.current.length) {
      stopSpeech();
      return;
    }

    const item = queueRef.current[currentIndexRef.current];
    setCurrentPlayingStep(item.step);

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = selectedVoiceRef.current?.lang || 'de-DE';
    utterance.rate = 0.90;
    utterance.pitch = 0.98;

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onend = () => {
      currentIndexRef.current += 1;
      const pauseDuration = item.isHeader ? 500 : 380;
      breathTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          speakNextWebChunk();
        }
      }, pauseDuration);
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('[useSpeechPlayer] Utterance-Fehler:', e.error);
      currentIndexRef.current += 1;
      speakNextWebChunk();
    };

    window.speechSynthesis.speak(utterance);
  }, [isWebSpeechAvailable, stopSpeech]);

  // Spielt eine Queue per Cloud-TTS (OpenAI / Google) ab
  const playQueueWithCloudTts = useCallback(
    async (queue: { text: string; step: number; isHeader?: boolean }[]) => {
      if (!settings?.speechApiKey) return;
      const provider = settings.speechProvider || 'google';
      const key = settings.speechApiKey.trim();

      // Kombiniere die Texte des Abschnitts für eine flüssige, hochqualitative Cloud-Generierung
      const fullText = queue.map((q) => q.text).join(' ');
      const step = queue[0]?.step || 1;

      try {
        setCurrentPlayingStep(step);
        setIsPlaying(true);
        isPlayingRef.current = true;

        let audioUrl = '';
        if (provider === 'openai') {
          audioUrl = await fetchOpenAiTts(fullText, key);
        } else {
          audioUrl = await fetchGoogleTts(fullText, key);
        }

        if (!isPlayingRef.current) return; // Wurde zwischenzeitlich gestoppt

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          stopSpeech();
        };

        audio.onerror = (err) => {
          console.error('[useSpeechPlayer] Audio Playback Fehler:', err);
          stopSpeech();
        };

        await audio.play();
      } catch (error: any) {
        console.error('[useSpeechPlayer] Cloud TTS API Fehler:', error);
        alert(`Sprachausgabe-Fehler (${provider}): ${error.message || 'Prüfe deinen API-Schlüssel in den Einstellungen.'}`);
        stopSpeech();
      }
    },
    [settings?.speechApiKey, settings?.speechProvider, stopSpeech]
  );

  // Einzelnen Posten vorlesen
  const playSection = useCallback(
    (stepNum: number, title: string, text: string) => {
      if (!text) return;

      if (isPlayingRef.current && currentPlayingStep === stepNum) {
        stopSpeech();
        return;
      }

      stopSpeech();

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

      if (isCloudTts) {
        playQueueWithCloudTts(queue);
      } else {
        speakNextWebChunk();
      }
    },
    [isCloudTts, currentPlayingStep, stopSpeech, playQueueWithCloudTts, speakNextWebChunk]
  );

  // Gesamten Report sequenziell vorlesen
  const playFullReport = useCallback(
    (report: LightflowReport) => {
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

      if (isCloudTts) {
        playQueueWithCloudTts(fullQueue);
      } else {
        speakNextWebChunk();
      }
    },
    [isCloudTts, stopSpeech, playQueueWithCloudTts, speakNextWebChunk]
  );

  const pauseSpeech = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (audioRef.current) {
      audioRef.current.pause();
    } else if (isWebSpeechAvailable) {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
  }, [isWebSpeechAvailable]);

  const resumeSpeech = useCallback(() => {
    if (!isPaused) return;
    if (audioRef.current) {
      audioRef.current.play();
    } else if (isWebSpeechAvailable) {
      window.speechSynthesis.resume();
    }
    setIsPaused(false);
  }, [isPaused, isWebSpeechAvailable]);

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
