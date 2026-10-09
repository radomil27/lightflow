import React, { useState } from 'react';
import { LightflowReport, AppSettings, LightSealType } from '../types';
import { useSpeechPlayer } from '../hooks/useSpeechPlayer';
import {
  Sparkles,
  Bookmark,
  Copy,
  Check,
  Volume2,
  FileText,
  Square,
  Share2,
  Users,
  ChevronDown,
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

export const POSTEN_SUBTITLES: Record<'seeker' | 'disciple' | 'exhausted', Record<number, string>> = {
  seeker: {
    1: 'Die Zusage an dich',
    2: 'Vorurteil vs. Realität',
    3: 'Der Praxistest',
    4: 'Kopf frei kriegen',
    5: 'Begegnung auf Augenhöhe',
    6: 'Ehrlicher Realitäts-Check',
    7: 'Offenes Wort vor Gott',
  },
  disciple: {
    1: 'Königliche Zusage',
    2: 'Falsch vs. Echt (Die Entlarvung)',
    3: 'Fleisch vs. Geist (Die Tat)',
    4: 'Dienst statt Opfer-Haltung',
    5: 'Fels statt Wind',
    6: 'Herzensprüfung & Umkehr',
    7: 'Feste Entscheidung & Hingabe',
  },
  exhausted: {
    1: 'Bedingungsloser Schutz',
    2: 'Gottes Maßstab vs. Leistungsdruck',
    3: 'Arbeiten ohne Ausbrennen',
    4: 'Sabbat-Ruhe & Entlastung',
    5: 'Gesunde Grenzen in Liebe',
    6: 'Wo machst du dich selbst kaputt?',
    7: 'Fallenlassen beim Vater',
  },
};

interface ReportViewProps {
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

export const ReportView: React.FC<ReportViewProps> = ({
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
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(report.notes || '');

  // Audio-Player ist standardmäßig deaktiviert (komplett unsichtbar).
  // Erst wenn Sprachausgabe in den Einstellungen aktiv ist UND ein gültiger API-Key hinterlegt wurde,
  // erscheint der Audio-Player-/Play-Button im Bericht.
  const isAudioAvailable = Boolean(
    settings?.speechEnabled &&
    settings?.speechApiKey &&
    settings.speechApiKey.trim().length > 0
  );

  // Speech-Player Hook (nutzt Cloud-TTS mit API-Key oder Fallback)
  const {
    isPlaying,
    currentPlayingStep,
    playSection,
    playFullReport,
    stopSpeech,
  } = useSpeechPlayer(settings);

  // Callback zum Wechseln der Passage (bevorzugt direkten Picker-Dialog, Fallback auf onEditPassage)
  const handlePassageClick = onOpenBiblePicker || onEditPassage;

  // Aktive Glaubensphase für dynamische Posten-Linsen (Untertitel)
  const activeFaithStage = normalizeFaithStage(report.profileSnapshot?.faithStage);

  // Accordion-State: Immer nur genau ein Posten geöffnet (Single-Accordion, 1 bis 7 oder null wenn alle zu)
  const [activeSection, setActiveSection] = useState<number | null>(1);
  const activeReportIdRef = React.useRef<string | null>(null);

  // Wenn ein Posten vorgelesen wird, klappe ihn automatisch auf und schließe die anderen
  React.useEffect(() => {
    if (currentPlayingStep !== null) {
      setActiveSection(currentPlayingStep);
    }
  }, [currentPlayingStep]);

  React.useEffect(() => {
    // Bei neuem Report startet Posten 1 offen für ruhiges, fokussiertes Lesen
    if (activeReportIdRef.current !== report.id) {
      activeReportIdRef.current = report.id;
      setActiveSection(1);
    }

    return () => {
      stopSpeech();
    };
  }, [report.id, report.timestamp, stopSpeech]);

  // Single-Accordion Umschalter: Wenn der aktive angetippt wird, zuklappen (null), sonst den angetippten öffnen
  const toggleSection = (stepNum: number) => {
    setActiveSection((prev) => (prev === stepNum ? null : stepNum));
  };

  // Statusanzeige für sequentielle Hintergrund-Generierung (1 bis 7)
  // Der grüne Haken ist entfernt (Clean Luxury). Nur bei aktivem Laden wird ein dezenter Hinweis gegeben.
  const isSectionLoading = (stepNum: number, textVal?: string) => {
    const state = report.sectionLoadingStates?.[stepNum];
    return state === 'loading' || (!textVal && state !== 'ready' && Boolean(report.sectionLoadingStates));
  };

  // Dynamische CSS-Klassen für Schriftgröße (Feierabend-Ergonomie)
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

  // Erkennt die 3 strukturierten Abschnitte von "KLARBLICK (Falsch vs. Echt)"
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
          <div className="rounded-2xl bg-stone-50/80 dark:bg-slate-900/50 p-4 border border-stone-200/60 dark:border-slate-800/60">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 block mb-1">
              🏛️ 1. Historischer Kontext & Kultur damals
            </span>
            <p className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
              {s1}
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50/80 dark:bg-slate-900/50 p-4 border border-stone-200/60 dark:border-slate-800/60">
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

  // Smart-Share-Funktion für WhatsApp, Telegram & Co. (mit Web-Share API & Clipboard-Fallback)
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
        // AbortError tritt auf, wenn der Nutzer das Teilen-Fenster manuell schließt
        if (err.name === 'AbortError') return;
      }
    }
    // Fallback für Desktop / nicht unterstützte Browser
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedSection(stepNum);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  // Erkenntnis-Siegel Badge im Posten-Kopf
  const renderSealBadge = (stepNum: number) => {
    const seal = report.lightSeals?.[stepNum];
    if (!seal) return null;
    const sealConfig = {
      clarity: { emoji: '🟡', label: 'Klarheit', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      obedience: { emoji: '🟢', label: 'Gehorsam', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      peace: { emoji: '🔵', label: 'Friede', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    }[seal];
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border flex items-center gap-1 ${sealConfig.color}`}>
        <span>{sealConfig.emoji}</span>
        <span className="hidden sm:inline">{sealConfig.label}</span>
      </span>
    );
  };

  // Siegel-Wählerleiste am Ende jedes ausgeklappten Postens
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

  // Button für den Circle of 4
  const renderCircleButton = (stepNum: number, title: string, text: string) => {
    if (!onShareToCircle) return null;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onShareToCircle(stepNum, title, text);
        }}
        className="p-1.5 rounded-lg text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
        title="Diesen Abschnitt in den vertrauten Kreis (Circle of 4) teilen"
      >
        <Users className="w-3.5 h-3.5" />
        <span className="text-[10px] hidden sm:inline">Kreis</span>
      </button>
    );
  };

  // Text in Zwischenablage kopieren
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

— Generiert mit Lightflow (Angeschlossen an die Quelle)`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500 overflow-x-hidden max-w-full touch-pan-y break-words">
      
      {/* Report Kopfzeile mit Metadaten & Aktionsleiste */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200/80 dark:border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            {handlePassageClick ? (
              <button
                type="button"
                onClick={handlePassageClick}
                className="group inline-flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-2xl text-left hover:bg-stone-200/50 dark:hover:bg-slate-800/60 active:scale-[0.98] transition-all cursor-pointer select-none"
                title="Tippen, um andere Bibelstelle auszuwählen"
              >
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9] group-hover:text-[#B45309] dark:group-hover:text-[#FDE68A] transition-colors">
                  {report.passage}
                </h2>
                <span className="p-1 rounded-lg text-stone-400 group-hover:text-[#E09F3E] group-hover:bg-[#E09F3E]/15 transition-all">
                  <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                </span>
              </button>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                {report.passage}
              </h2>
            )}
            {report.mood && (
              <span className="px-2.5 py-1 rounded-xl bg-[#E09F3E]/15 text-[#B45309] dark:text-[#FDE68A] text-xs font-medium border border-[#E09F3E]/25">
                🌿 {report.mood}
              </span>
            )}
          </div>
        </div>

        {/* Aktionsleiste (Audio, Favorit, Kopieren, Notiz) */}
        <div className="flex items-center space-x-2 shrink-0">
          {isAudioAvailable && (
            <button
              onClick={() => {
                if (isPlaying) {
                  stopSpeech();
                } else {
                  playFullReport(report);
                }
              }}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 animate-pulse font-semibold'
                  : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60'
              }`}
              title={isPlaying ? 'Vorlesen stoppen' : 'Gesamten Report flüssig vorlesen lassen'}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span className="hidden md:inline">
                    {currentPlayingStep ? `Posten ${currentPlayingStep}...` : 'Stopp'}
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#E09F3E]" />
                  <span className="hidden md:inline">Anhören</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onToggleFavorite(report.id)}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              report.favorite
                ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60'
            }`}
            title="Zu Favoriten hinzufügen"
          >
            <Bookmark className={`w-4 h-4 ${report.favorite ? 'fill-current text-[#E09F3E]' : ''}`} />
            <span className="hidden md:inline">Favorit</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Vollständigen Report kopieren"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">{copied ? 'Kopiert!' : 'Kopieren'}</span>
          </button>

          {/* Schriftgrößen-Schnellumschalter A- / A+ */}
          {onFontSizeChange && (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onFontSizeChange('sm')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'sm'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Kleine Schrift (14px)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('md')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'md'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Standard-Schrift (16px)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('lg')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'lg'
                    ? 'bg-[#E09F3E] text-slate-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Große Schrift für den Feierabend (18px)"
              >
                A+
              </button>
            </div>
          )}

          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-300 hover:border-[#E09F3E]/60 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Persönliche Gedanken notieren"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Notiz</span>
          </button>
        </div>
      </div>

      {/* 3. Integrierter gemeinfreier Bibel-Volltext-Viewer (Schlachter 1951 / Luther 1912) */}
      <BibleTextViewer passage={report.passage} onGenerateKlarblick={onGenerateKlarblick} />

      {/* Notiz-Eingabefeld falls geöffnet */}
      {notesOpen && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-2">
            Eigene Gedanken & Reflektion zu dieser Auswertung
          </label>
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={3}
            placeholder="Was hat mich besonders angesprochen? Was nehme ich heute mit?"
            className="w-full p-3 text-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                onSaveNotes(report.id, notesText);
                setNotesOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] transition-colors cursor-pointer"
            >
              Notiz speichern
            </button>
          </div>
        </div>
      )}

      {/* Die 7 Posten mit vertikal fließender Lichtlinie */}
      <div className="relative pl-6 sm:pl-10 space-y-7">
        
        {/* Vertikale Lichtleiter-Leitung links */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-6 w-0.5 bg-gradient-to-b from-[#FFFBEB] via-[#F59E0B] to-[#3E6B56] opacity-40"></div>
        <div className="absolute left-2 sm:left-3.5 top-0 w-1.5 h-12 bg-gradient-to-b from-transparent via-[#FDE68A] to-transparent rounded-full blur-[1px] animate-pulse"></div>

        {/* ========================================================
            POSTEN 1: LICHTFUNKE (Immer sofort sichtbar & ausklappbar)
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(1)}
            className="absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full bg-[#E09F3E] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#E09F3E]/30 ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer"
          >
            1
          </div>

          <div 
            onClick={() => toggleSection(1)}
            className={`rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-[#211B14] dark:via-[#18202A] dark:to-[#18202A] border border-[#E09F3E]/40 shadow-lg shadow-[#E09F3E]/5 relative overflow-hidden backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isSectionLoading(1, report.lichtfunke || report.coreConduit)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-[#E09F3E]/70'
            }`}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E09F3E]/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Akkordeon-Header: Minimalistisch, sauber, keine Icons rechts wenn zugeklappt */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none group-hover:bg-amber-500/5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                  <IconLichtfunke className="w-4 h-4 text-[#E09F3E]" />
                  <span>1. LICHTFUNKE</span>
                  {renderSealBadge(1)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][1]}
                </span>
              </div>

              {/* Statusindikator falls noch am Sammeln */}
              {isSectionLoading(1, report.lichtfunke || report.coreConduit) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt: Erst hier sind Teilen, Audio und Kopieren ersichtlich und bedienbar */}
            {activeSection === 1 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-amber-500/15 cursor-default"
              >
                <p className={`font-serif ${lichtfunkeTextClass} font-medium text-stone-900 dark:text-stone-100 leading-relaxed italic`}>
                  „{report.lichtfunke || report.coreConduit}“
                </p>

                {/* Edle Aktionsleiste (Audio, Kreis, Teilen, Kopieren) */}
                <div className="mt-5 pt-3.5 border-t border-amber-500/15 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(1, '1. Lichtfunke', report.lichtfunke || report.coreConduit || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 1
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 1 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 1 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 1 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Per WhatsApp / Telegram teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(1, '1. LICHTFUNKE', report.lichtfunke || report.coreConduit || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="In Zwischenablage kopieren"
                    >
                      {copiedSection === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 1 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(1)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 2: KLARBLICK
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(2)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 2 ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            2
          </div>

          <div 
            onClick={() => toggleSection(2)}
            className={`rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer ${
              isSectionLoading(2, report.klarblick || report.systemDecoded)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-[#E09F3E]/60'
            }`}
          >
            {/* Akkordeon-Header: Minimalistisch & sauber */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <IconKlarblick className="w-4 h-4 text-[#E09F3E]" />
                  <span>2. KLARBLICK</span>
                  {renderSealBadge(2)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][2]}
                </span>
              </div>

              {isSectionLoading(2, report.klarblick || report.systemDecoded) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 2 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60 cursor-default"
              >
                {renderKlarblickContent(report.klarblick || report.systemDecoded || '')}

                {/* Edle Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-white/[0.08] dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(2, '2. Klarblick', report.klarblick || report.systemDecoded || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 2
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 2 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 2 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 2 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(2, '2. KLARBLICK', report.klarblick || report.systemDecoded || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt kopieren"
                    >
                      {copiedSection === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 2 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(2)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 3: TAGWERK
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(3)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 3 ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            3
          </div>

          <div 
            onClick={() => toggleSection(3)}
            className={`rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer ${
              isSectionLoading(3, report.tagwerk || report.workBench)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-amber-500/40'
            }`}
          >
            {/* Akkordeon-Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <IconTagwerk className="w-4 h-4 text-[#E09F3E]" />
                  <span>3. TAGWERK</span>
                  {renderSealBadge(3)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][3]}
                </span>
              </div>

              {isSectionLoading(3, report.tagwerk || report.workBench) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 3 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60 cursor-default"
              >
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.tagwerk || report.workBench}
                </div>

                {/* Innenliegende Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-stone-200/50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(3, '3. Tagwerk', report.tagwerk || report.workBench || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 3
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 3 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 3 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 3 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(3, '3. TAGWERK', report.tagwerk || report.workBench || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(3, '3. TAGWERK', report.tagwerk || report.workBench || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(3, '3. TAGWERK', report.tagwerk || report.workBench || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt kopieren"
                    >
                      {copiedSection === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 3 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(3)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 4: FREIRAUM
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(4)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 4 ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            4
          </div>

          <div 
            onClick={() => toggleSection(4)}
            className={`rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer ${
              isSectionLoading(4, report.freiraum || report.dailyFreedom)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-amber-500/40'
            }`}
          >
            {/* Akkordeon-Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <IconFreiraum className="w-4 h-4 text-[#E09F3E]" />
                  <span>4. FREIRAUM</span>
                  {renderSealBadge(4)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][4]}
                </span>
              </div>

              {isSectionLoading(4, report.freiraum || report.dailyFreedom) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 4 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60 cursor-default"
              >
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.freiraum || report.dailyFreedom}
                </div>

                {/* Innenliegende Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-stone-200/50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(4, '4. Freiraum', report.freiraum || report.dailyFreedom || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 4
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 4 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 4 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 4 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(4, '4. FREIRAUM', report.freiraum || report.dailyFreedom || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt kopieren"
                    >
                      {copiedSection === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 4 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(4)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 5: STANDPUNKT
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(5)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 5 ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            5
          </div>

          <div 
            onClick={() => toggleSection(5)}
            className={`rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer ${
              isSectionLoading(5, report.standpunkt || report.profileSnapshot.relationshipStatus)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-amber-500/40'
            }`}
          >
            {/* Akkordeon-Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <IconStandpunkt className="w-4 h-4 text-[#E09F3E]" />
                  <span>5. STANDPUNKT</span>
                  {renderSealBadge(5)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][5]}
                </span>
              </div>

              {isSectionLoading(5, report.standpunkt || report.profileSnapshot.relationshipStatus) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 5 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60 cursor-default"
              >
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.standpunkt || report.profileSnapshot.relationshipStatus}
                </div>

                {/* Innenliegende Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-stone-200/50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(5, '5. Standpunkt', report.standpunkt || report.profileSnapshot.relationshipStatus || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 5
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 5 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 5 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 5 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(5, '5. STANDPUNKT', report.standpunkt || report.profileSnapshot.relationshipStatus || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt kopieren"
                    >
                      {copiedSection === 5 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 5 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(5)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 6: SPIEGEL
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(6)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 6 ? 'bg-[#E09F3E] text-slate-950 shadow-[#E09F3E]/30' : 'bg-slate-700 text-stone-300'
            }`}
          >
            6
          </div>

          <div 
            onClick={() => toggleSection(6)}
            className={`rounded-3xl bg-white/85 dark:bg-[#18202A]/85 border border-stone-200/90 dark:border-slate-800 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer ${
              isSectionLoading(6, report.spiegel)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-amber-500/40'
            }`}
          >
            {/* Akkordeon-Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <IconSpiegel className="w-4 h-4 text-[#E09F3E]" />
                  <span>6. SPIEGEL</span>
                  {renderSealBadge(6)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][6]}
                </span>
              </div>

              {isSectionLoading(6, report.spiegel) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 6 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-stone-100 dark:border-slate-800/60 cursor-default"
              >
                <div className={`${bodyTextClass} text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line`}>
                  {report.spiegel}
                </div>

                {/* Innenliegende Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-stone-200/50 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(6, '6. Spiegel', report.spiegel || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 6
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 6 ? 'Vorlesen anhalten' : 'Diesen Posten vorlesen'}
                      >
                        {currentPlayingStep === 6 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 6 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(6, '6. SPIEGEL', report.spiegel || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(6, '6. SPIEGEL', report.spiegel || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(6, '6. SPIEGEL', report.spiegel || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt kopieren"
                    >
                      {copiedSection === 6 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 6 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                {renderSealSelector(6)}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            POSTEN 7: LEUCHTKRAFT (Herzensgebet)
            ======================================================== */}
        <div className="relative group transition-all duration-300">
          <div 
            onClick={() => toggleSection(7)}
            className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ring-4 ring-stone-50 dark:ring-stone-950 cursor-pointer transition-colors ${
              activeSection === 7 ? 'bg-[#F59E0B] text-slate-950 shadow-[#F59E0B]/40 animate-light-pulse' : 'bg-slate-700 text-stone-300'
            }`}
          >
            7
          </div>

          <div 
            onClick={() => toggleSection(7)}
            className={`rounded-3xl bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-white dark:from-[#2B2114]/90 dark:via-[#1E2024] dark:to-[#2B2114]/50 border border-[#E09F3E]/50 shadow-xl shadow-[#E09F3E]/10 relative overflow-hidden backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isSectionLoading(7, report.leuchtkraft || report.heartGarden)
                ? 'opacity-60 saturate-50 animate-posten-gathering'
                : 'hover:border-[#E09F3E]/80'
            }`}
          >
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Akkordeon-Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between select-none group-hover:bg-amber-500/5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2.5 text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A]">
                  <IconLeuchtkraft className="w-4 h-4 text-[#E09F3E]" />
                  <span>7. LEUCHTKRAFT</span>
                  {renderSealBadge(7)}
                </div>
                <span className="text-[11px] font-normal italic text-stone-500 dark:text-stone-400 pl-6.5 sm:pl-0">
                  • {POSTEN_SUBTITLES[activeFaithStage][7]}
                </span>
              </div>

              {isSectionLoading(7, report.leuchtkraft || report.heartGarden) && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#E09F3E] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E09F3E]"></span>
                  <span className="hidden sm:inline">Sammelt...</span>
                </div>
              )}
            </div>

            {/* Ausgeklappter Inhalt */}
            {activeSection === 7 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 animate-in fade-in duration-300 border-t border-amber-200/50 dark:border-amber-900/30 cursor-default"
              >
                <div className={`${lichtfunkeTextClass} text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line font-serif italic border-l-2 border-[#E09F3E] pl-4 my-2`}>
                  {report.leuchtkraft || report.heartGarden}
                </div>

                {/* Innenliegende Aktionsleiste */}
                <div className="mt-5 pt-3.5 border-t border-amber-500/20 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    {isAudioAvailable && (
                      <button
                        type="button"
                        onClick={() => playSection(7, '7. Leuchtkraft, Herzensgebet', report.leuchtkraft || report.heartGarden || '')}
                        className={`px-2.5 py-1.5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer border ${
                          currentPlayingStep === 7
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold animate-pulse shadow-sm'
                            : 'bg-white/40 dark:bg-white/[0.04] text-stone-300 border-white/[0.08] hover:border-amber-500/40 hover:text-[#E09F3E]'
                        }`}
                        title={currentPlayingStep === 7 ? 'Vorlesen anhalten' : 'Dieses Gebet vorlesen'}
                      >
                        {currentPlayingStep === 7 ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        <span className="text-[11px]">{currentPlayingStep === 7 ? 'Stopp' : 'Vorlesen'}</span>
                      </button>
                    )}
                    {renderCircleButton(7, '7. LEUCHTKRAFT', report.leuchtkraft || report.heartGarden || '')}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleShareSection(7, '7. LEUCHTKRAFT', report.leuchtkraft || report.heartGarden || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Diesen Abschnitt teilen"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E09F3E]" />
                      <span className="text-[11px]">Teilen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySection(7, '7. LEUCHTKRAFT (Gebet)', report.leuchtkraft || report.heartGarden || '')}
                      className="px-2.5 py-1.5 rounded-xl bg-white/40 dark:bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 text-stone-300 hover:text-[#E09F3E] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      title="Dieses Gebet kopieren"
                    >
                      {copiedSection === 7 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSection === 7 ? 'Kopiert' : 'Kopieren'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Tief einatmen. Angekommen an der Quelle.</span>
                  <span className="text-[#B45309] dark:text-[#FDE68A] font-semibold">Du darfst sein.</span>
                </div>
                {renderSealSelector(7)}
              </div>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};
