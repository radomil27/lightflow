import React, { useState, useEffect } from 'react';
import { LightflowReport, AppSettings, LightSealType } from '../types';
import { useSpeechPlayer } from '../hooks/useSpeechPlayer';
import {
  Bookmark,
  Copy,
  Check,
  Volume2,
  FileText,
  Square,
  Share2,
  Users,
  Sparkles,
  ChevronDown,
  Layers,
  ChevronUp,
} from 'lucide-react';
import { BibleTextViewer } from './BibleTextViewer';
import { normalizeFaithStage } from '../services/storage';
import {
  IconLichtfunke,
  IconKlarblick,
  IconTagwerk,
  IconFreiraum,
  IconStandpunkt,
  IconSpiegel,
  IconLeuchtkraft,
} from './PostenIcons';
import { POSTEN_SUBTITLES } from './ReportView';

interface LeatherEtuiReportViewProps {
  report: LightflowReport;
  settings?: AppSettings;
  fontSize?: 'sm' | 'md' | 'lg';
  onToggleFavorite: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onFontSizeChange?: (size: 'sm' | 'md' | 'lg') => void;
  onEditPassage?: () => void;
  onOpenBiblePicker?: () => void;
  onGenerateKlarblick?: (passageWithTitle: string, selectedText?: string) => void;
  onShareToCircle?: (postenIndex: number, title: string, content: string) => void;
  onToggleSeal?: (postenIndex: number, seal: LightSealType) => void;
}

export const LeatherEtuiReportView: React.FC<LeatherEtuiReportViewProps> = ({
  report,
  settings,
  fontSize = 'md',
  onToggleFavorite,
  onSaveNotes,
  onFontSizeChange,
  onEditPassage,
  onOpenBiblePicker,
  onGenerateKlarblick,
  onShareToCircle,
  onToggleSeal,
}) => {
  // Fächer-Zustand: Wenn true, sind die 7 Karten herausgefächert
  const [isFannedOut, setIsFannedOut] = useState<boolean>(true);
  
  // Aktive ausgeklappte Karte für vollen Lesefokus
  const [activeCard, setActiveCard] = useState<number | null>(1);

  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(report.notes || '');

  const isAudioAvailable = Boolean(
    settings?.speechEnabled &&
    settings?.speechApiKey &&
    settings.speechApiKey.trim().length > 0
  );

  const {
    isPlaying,
    currentPlayingStep,
    playFullReport,
    playSection,
    stopSpeech,
  } = useSpeechPlayer(settings);

  const activeFaithStage = normalizeFaithStage(report.profileSnapshot?.faithStage);

  // Synchronisiere aktiven Sprach-Schritt mit Karte
  useEffect(() => {
    if (currentPlayingStep !== null) {
      setIsFannedOut(true);
      setActiveCard(currentPlayingStep);
    }
  }, [currentPlayingStep]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [report.id, stopSpeech]);

  const isSectionLoading = (stepNum: number, textVal?: string) => {
    const state = report.sectionLoadingStates?.[stepNum];
    return state === 'loading' || (!textVal && state !== 'ready' && Boolean(report.sectionLoadingStates));
  };

  const bodyTextClass =
    fontSize === 'sm'
      ? 'text-sm'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl font-normal leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  const lichtfunkeTextClass =
    fontSize === 'sm'
      ? 'text-base sm:text-lg'
      : fontSize === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-lg sm:text-xl';

  // Erkennt die 3 strukturierten Abschnitte von "KLARBLICK"
  const renderKlarblickContent = (text: string) => {
    const s1Match = text.match(/(?:(?:\r?\n|^)\s*(?:###|##|#|\*\*|)\s*1\.\s*Historischer Kontext[^\n:]*:?\*?\*?\s*)([\s\S]*?)(?=(?:\r?\n\s*(?:###|##|#|\*\*|)\s*2\.\s*Urtext)|$)/i);
    const s2Match = text.match(/(?:(?:\r?\n|^)\s*(?:###|##|#|\*\*|)\s*2\.\s*Urtext[^\n:]*:?\*?\*?\s*)([\s\S]*?)(?=(?:\r?\n\s*(?:###|##|#|\*\*|)\s*3\.\s*Klarblick)|$)/i);
    const s3Match = text.match(/(?:(?:\r?\n|^)\s*(?:###|##|#|\*\*|)\s*3\.\s*Klarblick[^\n:]*:?\*?\*?\s*)([\s\S]*?)$/i);

    const cleanSection = (val?: string) => {
      if (!val) return '';
      return val.trim().replace(/^\*+\s*/, '').replace(/\s*\*+$/, '');
    };

    const s1 = cleanSection(s1Match?.[1]);
    const s2 = cleanSection(s2Match?.[1]);
    const s3 = cleanSection(s3Match?.[1]);

    if (s1 && s2 && s3) {
      return (
        <div className="space-y-3.5 pt-1">
          <div className="rounded-2xl bg-stone-50/80 dark:bg-black/40 p-4 border border-stone-200/60 dark:border-white/[0.06]">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 block mb-1">
              🏛️ 1. Historischer Kontext & Kultur damals
            </span>
            <p className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
              {s1}
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50/80 dark:bg-black/40 p-4 border border-stone-200/60 dark:border-white/[0.06]">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 block mb-1">
              📜 2. Urtext & Symbolik
            </span>
            <p className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
              {s2}
            </p>
          </div>

          <div className="rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 p-4 border border-amber-500/25 dark:border-amber-500/30">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 block mb-1">
              ⚡ 3. Klarblick für heute (Falsch vs. Echt)
            </span>
            <p className={`${bodyTextClass} text-stone-800 dark:text-stone-100 font-medium leading-relaxed`}>
              {s3}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
        {text}
      </div>
    );
  };

  const handleCopySection = (stepNum: number, title: string, text: string) => {
    const sectionText = `LIGHTFLOW: ${report.passage}\n${title}\n\n${text}\n\n— Angeschlossen an die Quelle\nhttps://lightflow-app-two.vercel.app`;
    navigator.clipboard.writeText(sectionText).then(() => {
      setCopiedSection(stepNum);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const handleShareSection = async (stepNum: number, title: string, text: string) => {
    const shareText = `✨ Lightflow – ${report.passage}\n${title}:\n${text}\n\n🔗 https://lightflow-app-two.vercel.app`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lightflow – ${report.passage} (${title})`,
          text: shareText,
          url: 'https://lightflow-app-two.vercel.app',
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedSection(stepNum);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const renderSealBadge = (stepNum: number) => {
    const seal = report.lightSeals?.[stepNum];
    if (!seal) return null;
    const sealConfig = {
      clarity: { emoji: '🟡', label: 'Klarheit', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      obedience: { emoji: '🟢', label: 'Gehorsam', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      peace: { emoji: '🔵', label: 'Friede', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    }[seal];
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${sealConfig.color}`}>
        <span>{sealConfig.emoji}</span>
        <span className="hidden sm:inline">{sealConfig.label}</span>
      </span>
    );
  };

  const renderSealSelector = (stepNum: number) => {
    const currentSeal = report.lightSeals?.[stepNum];
    return (
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-stone-200/50 dark:border-white/[0.06] text-xs">
        <span className="text-[11px] text-stone-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E09F3E]" />
          <span>Erkenntnis-Siegel:</span>
        </span>
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSeal?.(stepNum, 'clarity');
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
              currentSeal === 'clarity'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400'
                : 'bg-stone-100 dark:bg-white/[0.05] text-stone-500 dark:text-stone-400 hover:bg-amber-500/15 hover:text-amber-300'
            }`}
            title="🟡 Klarheit: Ein Irrtum wurde aufgedeckt"
          >
            🟡 Klarheit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSeal?.(stepNum, 'obedience');
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
              currentSeal === 'obedience'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm ring-1 ring-emerald-400'
                : 'bg-stone-100 dark:bg-white/[0.05] text-stone-500 dark:text-stone-400 hover:bg-emerald-500/15 hover:text-emerald-300'
            }`}
            title="🟢 Gehorsam: Konkrete Tat für heute"
          >
            🟢 Gehorsam
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSeal?.(stepNum, 'peace');
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
              currentSeal === 'peace'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm ring-1 ring-sky-400'
                : 'bg-stone-100 dark:bg-white/[0.05] text-stone-500 dark:text-stone-400 hover:bg-sky-500/15 hover:text-sky-300'
            }`}
            title="🔵 Friede: Entlastung und Gnade empfangen"
          >
            🔵 Friede
          </button>
        </div>
      </div>
    );
  };

  const renderCircleButton = (stepNum: number, title: string, text: string) => {
    if (!onShareToCircle) return null;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onShareToCircle(stepNum, title, text);
        }}
        className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
        title="Diesen Abschnitt in den Kreis (Circle of 4) teilen"
      >
        <Users className="w-3.5 h-3.5 text-[#E09F3E]" />
        <span className="text-[11px]">Kreis</span>
      </button>
    );
  };

  const handleCopy = () => {
    const fullText = `LIGHTFLOW REPORT: ${report.passage}
Verbindungsprofil: ${report.profileSnapshot.profession} | ${report.profileSnapshot.mindset}
Verfassung: ${report.mood}

1. LICHTFUNKE
${report.lichtfunke || report.coreConduit}

2. KLARBLICK
${report.klarblick || report.systemDecoded}

3. TAGWERK
${report.tagwerk || report.workBench}

4. FREIRAUM
${report.freiraum || report.dailyFreedom}

5. STANDPUNKT
${report.standpunkt || report.profileSnapshot.relationshipStatus}

6. SPIEGEL
${report.spiegel}

7. LEUCHTKRAFT
${report.leuchtkraft || report.heartGarden}

— Angeschlossen an die Quelle
https://lightflow-app-two.vercel.app`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePassageClick = onOpenBiblePicker || onEditPassage;

  // Posten Konfiguration für 3D-Karten
  const postenList = [
    {
      num: 1,
      title: '1. LICHTFUNKE',
      content: report.lichtfunke || report.coreConduit,
      icon: IconLichtfunke,
      color: 'from-amber-500/20 to-amber-900/10',
      badgeColor: 'text-amber-400',
      isPrayer: false,
    },
    {
      num: 2,
      title: '2. KLARBLICK',
      content: report.klarblick || report.systemDecoded,
      icon: IconKlarblick,
      color: 'from-amber-600/15 to-slate-900/20',
      badgeColor: 'text-amber-300',
      isPrayer: false,
    },
    {
      num: 3,
      title: '3. TAGWERK',
      content: report.tagwerk || report.workBench,
      icon: IconTagwerk,
      color: 'from-amber-700/15 to-slate-900/20',
      badgeColor: 'text-amber-300',
      isPrayer: false,
    },
    {
      num: 4,
      title: '4. FREIRAUM',
      content: report.freiraum || report.dailyFreedom,
      icon: IconFreiraum,
      color: 'from-emerald-700/15 to-slate-900/20',
      badgeColor: 'text-emerald-400',
      isPrayer: false,
    },
    {
      num: 5,
      title: '5. STANDPUNKT',
      content: report.standpunkt || report.profileSnapshot.relationshipStatus,
      icon: IconStandpunkt,
      color: 'from-sky-700/15 to-slate-900/20',
      badgeColor: 'text-sky-400',
      isPrayer: false,
    },
    {
      num: 6,
      title: '6. SPIEGEL',
      content: report.spiegel,
      icon: IconSpiegel,
      color: 'from-purple-700/15 to-slate-900/20',
      badgeColor: 'text-purple-400',
      isPrayer: false,
    },
    {
      num: 7,
      title: '7. LEUCHTKRAFT',
      content: report.leuchtkraft || report.heartGarden,
      icon: IconLeuchtkraft,
      color: 'from-amber-500/30 via-orange-950/20 to-black',
      badgeColor: 'text-[#FDE68A]',
      isPrayer: true,
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 animate-in fade-in duration-500 overflow-x-hidden touch-pan-y">
      
      {/* Unsichtbarer SVG-Filter für verlustfreie, ultra-realistische Narbenleder-Struktur */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="leather-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0.33 0 0 0 0
                      0 0.22 0 0 0
                      0 0 0.14 0 0
                      0 0 0 0.85 0"
              result="coloredNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
          </filter>
        </defs>
      </svg>

      {/* ========================================================
          DAS HAUPTELEMENT: EDLES LEDER-PORTEMONNAIE / ETUI
          ======================================================== */}
      <div className="relative rounded-[32px] sm:rounded-[36px] leather-wallet-surface border border-[#3D2514]/80 shadow-[0_22px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(212,175,55,0.18)] p-4 sm:p-7 overflow-hidden transition-all duration-500">
        
        {/* Handgenähte Steppnaht (gestrichelte Ziernaht in Champagner-Gold) */}
        <div className="absolute inset-2 sm:inset-3 rounded-[26px] sm:rounded-[30px] leather-stitching pointer-events-none" />

        {/* Sanfte Lichtreflektion auf dem Leder */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Etui-Kopf: Massives Messingschild mit Bibelstelle & Tool-Leiste */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#3D2514]/90">
          
          {/* Massives geprägtes Gold-Messingschild */}
          <div className="flex items-center gap-3">
            <div 
              onClick={handlePassageClick}
              className="brass-embossed-plaque px-4 py-2 rounded-2xl cursor-pointer group flex items-center gap-2.5 transition-transform active:scale-95"
              title="Bibelstelle wechseln"
            >
              <div className="w-2 h-2 rounded-full bg-[#52340B] shadow-inner" />
              <span className="font-serif font-black text-sm sm:text-base tracking-wider text-[#351D05] uppercase">
                {report.passage}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#351D05]/80 group-hover:translate-y-0.5 transition-transform" />
              <div className="w-2 h-2 rounded-full bg-[#52340B] shadow-inner" />
            </div>

            {report.mood && (
              <span className="px-3 py-1 rounded-full bg-black/40 border border-amber-500/20 text-[#FDE68A] text-xs font-serif italic backdrop-blur-sm">
                🌿 {report.mood}
              </span>
            )}
          </div>

          {/* Steuerung & Aktionen */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Audio Vorlesen */}
            {isAudioAvailable && (
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    stopSpeech();
                  } else {
                    playFullReport(report);
                  }
                }}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-md'
                    : 'bg-black/40 border-[#4A2F1B] text-[#FDE68A] hover:border-amber-500/50'
                }`}
                title={isPlaying ? 'Vorlesen stoppen' : 'Gesamten Report flüssig vorlesen'}
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden md:inline">{isPlaying ? 'Stopp' : 'Anhören'}</span>
              </button>
            )}

            {/* Favorit */}
            <button
              type="button"
              onClick={() => onToggleFavorite(report.id)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                report.favorite
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-black/40 border-[#4A2F1B] text-stone-300 hover:border-amber-500/50'
              }`}
              title="Zu Favoriten hinzufügen"
            >
              <Bookmark className={`w-3.5 h-3.5 ${report.favorite ? 'fill-current text-amber-400' : ''}`} />
            </button>

            {/* Kopieren */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2.5 rounded-xl border border-[#4A2F1B] bg-black/40 text-stone-300 hover:border-amber-500/50 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Kompletten Report kopieren"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Notiz */}
            <button
              type="button"
              onClick={() => setNotesOpen(!notesOpen)}
              className="p-2.5 rounded-xl border border-[#4A2F1B] bg-black/40 text-stone-300 hover:border-amber-500/50 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Notiz verfassen"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>

            {/* Schriftgrößen-Schnellumschalter */}
            {onFontSizeChange && (
              <div className="flex items-center bg-black/40 border border-[#4A2F1B] rounded-xl p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onFontSizeChange('sm')}
                  className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fontSize === 'sm'
                      ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Kompakte Schrift"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('md')}
                  className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fontSize === 'md'
                      ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Standard Schrift"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('lg')}
                  className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fontSize === 'lg'
                      ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Große Schrift (Feierabend-Modus)"
                >
                  A+
                </button>
              </div>
            )}

            {/* 3D-Fächer Umschalter (Popup Card Holder Toggle) */}
            <button
              type="button"
              onClick={() => setIsFannedOut(!isFannedOut)}
              className="px-3 py-2 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-[#FDE68A] hover:border-amber-500/60 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Kartenetui auffächern / schließen"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isFannedOut ? 'Fächer schließen' : 'Auffächern'}</span>
            </button>
          </div>
        </div>

        {/* Bibel-Volltext-Viewer integriert im Leder-Etui */}
        <div className="relative z-10 my-4">
          <BibleTextViewer passage={report.passage} onGenerateKlarblick={onGenerateKlarblick} />
        </div>

        {/* Notizen-Feld falls geöffnet */}
        {notesOpen && (
          <div className="relative z-10 mb-6 p-4 rounded-2xl bg-black/50 border border-amber-500/30 animate-in fade-in">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#FDE68A] block mb-2 font-serif">
              Persönliche Notiz im Etui aufbewahren
            </label>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={3}
              placeholder="Was nehme ich heute mit?"
              className="w-full p-3 text-sm rounded-xl bg-[#140C07] border border-[#4A2F1B] text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  onSaveNotes(report.id, notesText);
                  setNotesOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-colors cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            DER POPUP CARD HOLDER: DIE 7 GESTAFFELTEN KARTEN (3D)
            ======================================================== */}
        <div className="relative z-10 mt-6 pt-2 card-stack-perspective">
          
          <div className="flex flex-col space-y-4">
            {postenList.map((posten, index) => {
              const isActive = activeCard === posten.num;
              const isLoading = isSectionLoading(posten.num, posten.content);
              const PostenIcon = posten.icon;
              
              // 3D-Staffel Transform: Wenn gefächert, staffeln sich die Karten mit leichtem Versatz und Tiefe
              const stackTranslateY = isFannedOut ? 0 : -(index * 36);
              const stackScale = isFannedOut ? 1 : 1 - index * 0.02;
              const stackRotateX = isFannedOut ? 0 : 4;

              return (
                <div
                  key={posten.num}
                  style={{
                    transform: `translate3d(0, ${stackTranslateY}px, 0) scale(${stackScale}) rotateX(${stackRotateX}deg)`,
                    zIndex: isActive ? 40 : 20 - index,
                    transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`group relative rounded-2xl sm:rounded-3xl border transition-all duration-500 overflow-hidden backdrop-blur-md cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1C130D] via-[#140C07] to-[#0D0804] border-amber-500/60 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9),0_0_24px_rgba(224,159,62,0.18)]'
                      : 'bg-[#18110B]/90 hover:bg-[#22160F] border-[#3D2514] hover:border-amber-500/40 shadow-md'
                  } ${isLoading ? 'opacity-60 saturate-50 animate-posten-gathering' : ''}`}
                  onClick={() => {
                    setActiveCard(isActive ? null : posten.num);
                    if (!isFannedOut) setIsFannedOut(true);
                  }}
                >
                  {/* Metallene Lichtkante oben */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

                  {/* Karten-Kopfzeile */}
                  <div className="p-4 sm:p-5.5 flex items-center justify-between select-none">
                    <div className="flex items-center space-x-3.5">
                      {/* Nummerierte Plakette */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-serif font-black shadow-inner border border-amber-500/30 ${
                        isActive
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold'
                          : 'bg-black/50 text-[#FDE68A]'
                      }`}>
                        {posten.num}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#FDE68A]">
                          <PostenIcon className="w-4 h-4 text-amber-400" />
                          <span>{posten.title}</span>
                          {renderSealBadge(posten.num)}
                        </div>
                        <span className="text-[11px] font-normal italic text-stone-400 pl-6 sm:pl-0">
                          • {POSTEN_SUBTITLES[activeFaithStage][posten.num]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isLoading && (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="hidden sm:inline">Sammelt...</span>
                        </div>
                      )}

                      <div className="text-stone-400 group-hover:text-amber-400 transition-colors">
                        {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Ausgeklappter Text & Lesemodus */}
                  {isActive && (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 animate-in fade-in duration-300 border-t border-[#3D2514]/80 cursor-default"
                    >
                      {posten.num === 2 ? (
                        renderKlarblickContent(posten.content || '')
                      ) : posten.isPrayer ? (
                        <div className={`${lichtfunkeTextClass} text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-amber-500 pl-4 my-2`}>
                          {posten.content}
                        </div>
                      ) : (
                        <div className={`${bodyTextClass} text-stone-200 leading-relaxed whitespace-pre-line`}>
                          {posten.content}
                        </div>
                      )}

                      {/* Innenliegende Aktionsleiste */}
                      <div className="mt-5 pt-3.5 border-t border-[#3D2514]/90 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          {isAudioAvailable && (
                            <button
                              type="button"
                              onClick={() => playSection(posten.num, posten.title, posten.content || '')}
                              className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                                currentPlayingStep === posten.num
                                  ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                                  : 'bg-black/40 text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-amber-300'
                              }`}
                              title={currentPlayingStep === posten.num ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                            >
                              {currentPlayingStep === posten.num ? (
                                <Square className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                              )}
                              <span className="text-[11px]">{currentPlayingStep === posten.num ? 'Stopp' : 'Vorlesen'}</span>
                            </button>
                          )}
                          {renderCircleButton(posten.num, posten.title, posten.content || '')}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleShareSection(posten.num, posten.title, posten.content || '')}
                            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                            title="Diesen Abschnitt teilen"
                          >
                            <Share2 className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px]">Teilen</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopySection(posten.num, posten.title, posten.content || '')}
                            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                            title="Diesen Abschnitt kopieren"
                          >
                            {copiedSection === posten.num ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">{copiedSection === posten.num ? 'Kopiert' : 'Kopieren'}</span>
                          </button>
                        </div>
                      </div>

                      {renderSealSelector(posten.num)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
};
