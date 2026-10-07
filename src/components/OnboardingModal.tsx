import React, { useState } from 'react';
import { UserProfile, Gender, FaithStage } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Brain,
  Briefcase
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (completedProfile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
}) => {
  const [step, setStep] = useState<number>(1);

  // Schritt 1 State
  const [displayName, setDisplayName] = useState<string>(initialProfile?.displayName || '');
  const [gender, setGender] = useState<Gender | undefined>(initialProfile?.gender);

  // Schritt 2 State
  const [faithStage, setFaithStage] = useState<FaithStage | undefined>(
    (initialProfile?.faithStage as FaithStage) || undefined
  );

  // Schritt 3 State
  const [mindset, setMindset] = useState<string>(initialProfile?.mindset || '');

  // Schritt 4 State
  const [profession, setProfession] = useState<string>(initialProfile?.profession || '');
  const [customProfession, setCustomProfession] = useState<string>('');
  const [professionDetail, setProfessionDetail] = useState<string>(initialProfile?.professionDetail || '');
  const [isCustomProfessionSelected, setIsCustomProfessionSelected] = useState<boolean>(false);

  // Schritt 5 State
  const [relationshipStatus, setRelationshipStatus] = useState<string>(
    initialProfile?.relationshipStatus || ''
  );

  if (!isOpen) return null;

  // Validierung für linearen Flow (Weiter-Button stets disabled bis Pflichtauswahl erfolgt)
  const isCurrentStepValid = (): boolean => {
    switch (step) {
      case 1:
        return gender !== undefined;
      case 2:
        return faithStage !== undefined;
      case 3:
        return mindset.trim().length > 0;
      case 4:
        if (isCustomProfessionSelected) {
          return customProfession.trim().length > 0;
        }
        return profession.trim().length > 0;
      case 5:
        return relationshipStatus.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      // Abschluss
      const finalProfession = isCustomProfessionSelected ? customProfession.trim() : profession.trim();
      const finalProfile: UserProfile = {
        displayName: displayName.trim() || undefined,
        gender: gender || 'male',
        faithStage: faithStage || 'disciple',
        journeyStage:
          faithStage === 'seeker'
            ? 'Am Suchen & Zweifeln'
            : faithStage === 'exhausted'
            ? 'Müde & Ausgebrannt'
            : 'Mitten im Alltag & Nachfolge',
        mindset: mindset.trim(),
        profession: finalProfession,
        professionDetail: professionDetail.trim() || undefined,
        relationshipStatus: relationshipStatus.trim(),
        dailyMood: 'Unter Druck / Erschöpft',
        hasCompletedOnboarding: true,
      };
      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const selectProfessionPreset = (preset: string) => {
    setIsCustomProfessionSelected(false);
    setProfession(preset);
  };

  const selectCustomProfessionMode = () => {
    setIsCustomProfessionSelected(true);
    setProfession('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF9F6] dark:bg-[#151B22] border border-stone-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header mit Fortschritt */}
        <div className="pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Verbindungsprofil einrichten
            </span>
            <span className="text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-stone-200/60 dark:border-slate-700/60">
              Schritt {step} von 5
            </span>
          </div>

          {/* 5-Segment Fortschrittsbalken */}
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s < step
                    ? 'bg-emerald-500'
                    : s === step
                    ? 'bg-[#E09F3E]'
                    : 'bg-stone-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollbarer Inhaltsbereich */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-5 space-y-4 pr-1">
          
          {/* ========================================================
              SCHRITT 1: IDENTITÄT (RUFNAME & GESCHLECHT)
              ======================================================== */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  Wie darf Jesus dich ansprechen?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Keine Seelsorge-Floskeln – das Profil steuert Tonalität und biblische Führung.
                </p>
              </div>

              {/* Rufname (optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E09F3E]" />
                  Dein Rufname / Vorname (optional)
                </label>
                <div className="flex items-center px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50 focus-within:border-[#E09F3E] transition-all">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="z. B. Radovan"
                    className="w-full bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Lass es leer, um mit einem einfachen Du angesprochen zu werden.
                </p>
              </div>

              {/* Geschlecht (Pflicht) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Dein Geschlecht (Pflicht)</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                    {gender ? '✓ Gewählt' : 'Bitte auswählen'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-[#E09F3E]/15 border-[#E09F3E] shadow-md shadow-[#E09F3E]/10 ring-2 ring-[#E09F3E]/40'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">🧔</span>
                    <span className={`text-sm font-semibold ${gender === 'male' ? 'text-[#B45309] dark:text-[#FDE68A]' : 'text-stone-800 dark:text-stone-200'}`}>
                      Mann
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 text-center">
                      Fokus auf Stärke, Demut & Selbstbeherrschung
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-[#E09F3E]/15 border-[#E09F3E] shadow-md shadow-[#E09F3E]/10 ring-2 ring-[#E09F3E]/40'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">👩</span>
                    <span className={`text-sm font-semibold ${gender === 'female' ? 'text-[#B45309] dark:text-[#FDE68A]' : 'text-stone-800 dark:text-stone-200'}`}>
                      Frau
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 text-center">
                      Fokus auf innere Ruhe, Würde & geborgene Kraft
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SCHRITT 2: GLAUBENSPHASE
              ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  Wo stehst du aktuell geistlich?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Passt die theologische Tiefe an deine Lebensphase an.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Seeker */}
                <button
                  type="button"
                  onClick={() => setFaithStage('seeker')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    faithStage === 'seeker'
                      ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">🌱</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Am Suchen & Zweifeln</span>
                      {faithStage === 'seeker' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Offene Fragen, Skepsis, Fundamentsuche. Klare Erklärungen statt theologischem Insider-Jargon.
                    </p>
                  </div>
                </button>

                {/* Disciple */}
                <button
                  type="button"
                  onClick={() => setFaithStage('disciple')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    faithStage === 'disciple'
                      ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">⚒️</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Mitten im Alltag & Nachfolge</span>
                      {faithStage === 'disciple' && <Check className="w-4 h-4 text-[#E09F3E]" />}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Glaubt, ringt täglich mit Fleisch vs. Geist und will Täter des Wortes im Beruf und Alltag sein.
                    </p>
                  </div>
                </button>

                {/* Exhausted */}
                <button
                  type="button"
                  onClick={() => setFaithStage('exhausted')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    faithStage === 'exhausted'
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mt-0.5">🛡️</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Müde & Ausgebrannt</span>
                      {faithStage === 'exhausted' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Geistlich oder körperlich erschöpft. Braucht pure Gnade, das vollbrachte Werk Christi und Entlastung statt Druck.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              SCHRITT 3: DENKTYP-SZENARIOTEST
              ======================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  Szenario-Test
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9] mt-1">
                  „Ein Kollege oder Partner kritisiert deine Arbeit unerwartet scharf. Was ist dein erster innerer Impuls?“
                </h3>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'Analytisch & Lösungsorientiert',
                    icon: '⚙️',
                    quote: '„Ich prüfe sachlich die Fakten und suche sofort die technische/logische Lösung.“',
                    label: 'Analytisch & Lösungsorientiert',
                  },
                  {
                    id: 'Emotional & Beziehungsorientiert',
                    icon: '🛡️',
                    quote: '„Es trifft mich emotional oder erzeugt Ärger; ich muss mich erst innerlich sammeln.“',
                    label: 'Emotional & Beziehungsorientiert',
                  },
                  {
                    id: 'Pragmatisch & Macher',
                    icon: '🎯',
                    quote: '„Schuldfrage egal: Wie bringen wir das Projekt jetzt ohne Zeitverlust weiter?“',
                    label: 'Pragmatisch & Macher',
                  },
                  {
                    id: 'Reflektiert & Tiefgründig',
                    icon: '🕊️',
                    quote: '„Ich gehe auf Distanz und frage mich, was zwischenmenschlich dahintersteckt.“',
                    label: 'Reflektiert & Tiefgründig',
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMindset(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      mindset === item.id
                        ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs italic font-serif text-stone-900 dark:text-stone-100 leading-relaxed">
                          {item.quote}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#B45309] dark:text-[#FDE68A]">
                          <span>→ Typ: {item.label}</span>
                          {mindset === item.id && <Check className="w-3.5 h-3.5 text-[#E09F3E]" />}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              SCHRITT 4: BERUFSFELD
              ======================================================== */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  In welcher Arbeitswelt bewegst du dich?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Daraus schöpft Lightflow reale Werkzeuge und Merk-Bilder für Posten 3 (Tagwerk).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: 'Handwerk, Montage & Bau', icon: '🔨' },
                  { name: 'Büro, IT & Verwaltung', icon: '💻' },
                  { name: 'Pflege, Gesundheit & Soziales', icon: '🏥' },
                  { name: 'Logistik, Transport & Unterwegs', icon: '🚛' },
                  { name: 'Haushalt, Familie & Erziehung', icon: '🏠' },
                ].map((item) => {
                  const isSelected = !isCustomProfessionSelected && profession === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => selectProfessionPreset(item.name)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 font-semibold text-[#B45309] dark:text-[#FDE68A]'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-xs leading-snug flex-1">{item.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#E09F3E] shrink-0" />}
                    </button>
                  );
                })}

                {/* Freitext-Kachel */}
                <button
                  type="button"
                  onClick={selectCustomProfessionMode}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isCustomProfessionSelected
                      ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 font-semibold text-[#B45309] dark:text-[#FDE68A]'
                      : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <span className="text-xl">✏️</span>
                  <span className="text-xs leading-snug flex-1">Anderes Berufsfeld...</span>
                  {isCustomProfessionSelected && <Check className="w-4 h-4 text-[#E09F3E] shrink-0" />}
                </button>
              </div>

              {/* Freitext-Eingabe wenn 'Anderes' gewählt */}
              {isCustomProfessionSelected && (
                <div className="space-y-1.5 animate-in fade-in duration-200 pt-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Dein Berufsfeld eingeben:
                  </label>
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50">
                    <input
                      type="text"
                      value={customProfession}
                      onChange={(e) => setCustomProfession(e.target.value)}
                      placeholder="z. B. Landwirtschaft, Vertrieb, Gastronomie..."
                      className="w-full bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Detail-Feld optional */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#E09F3E]" />
                  Genaue Tätigkeit / Spezialisierung (optional)
                </label>
                <div className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50">
                  <input
                    type="text"
                    value={professionDetail}
                    onChange={(e) => setProfessionDetail(e.target.value)}
                    placeholder="z. B. Granit auf Gehrung montieren, Silikonfugen, Kundendienst..."
                    className="w-full bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SCHRITT 5: LEBENSRAHMEN
              ======================================================== */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  In welchem Lebensrahmen lebst du?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Steuert Posten 4 (Freiraum) und Posten 5 (Standpunkt im Miteinander).
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Verheiratet / Feste Partnerschaft',
                    icon: '💍',
                    desc: 'Gemeinsames Tragen, Verantwortung, partnerschaftliche Rücksicht und Absprache.',
                  },
                  {
                    name: 'Single / Alleinlebend',
                    icon: '👤',
                    desc: 'Stille am Abend, Selbstorganisation, Verarbeiten des Tages ohne direktes Gegenüber.',
                  },
                  {
                    name: 'Familie / Kinder im Haus',
                    icon: '👨‍👧',
                    desc: 'Wenig Eigenzeit, hohe Taktung, Erwartungsdruck, lebendiger Trubel nach Feierabend.',
                  },
                  {
                    name: 'In Umbruch / Aufarbeitung',
                    icon: '🌪️',
                    desc: 'Trennung, Neuorientierung, veränderte Lebensumstände, emotionale Neuordnung.',
                  },
                ].map((item) => {
                  const isSelected = relationshipStatus === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setRelationshipStatus(item.name)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                          <span>{item.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#E09F3E]" />}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isCurrentStepValid()
                ? 'bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] active:scale-[0.98]'
                : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{step === 5 ? 'Profil speichern & Lightflow starten' : 'Weiter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
