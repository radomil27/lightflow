import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile, Gender, FaithStage } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Search,
  X,
  Info
} from 'lucide-react';
import { PROFESSIONS_DATA, ProfessionItem } from '../data/professionsData';

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

  // Schritt 1 State: Identität (Rufname & Geschlecht)
  const [displayName, setDisplayName] = useState<string>(initialProfile?.displayName || '');
  const [gender, setGender] = useState<Gender | undefined>(initialProfile?.gender);

  // Schritt 2 State: Glaubensphase
  const [faithStage, setFaithStage] = useState<FaithStage | undefined>(
    (initialProfile?.faithStage as FaithStage) || undefined
  );

  // Schritt 3 State: 1 einziges Eingabefeld mit Autocomplete & Info-Tooltip
  const [professionInput, setProfessionInput] = useState<string>(initialProfile?.profession || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Schritt 4 State: Lebensrahmen
  const [relationshipStatus, setRelationshipStatus] = useState<string>(
    initialProfile?.relationshipStatus || ''
  );

  // Klick außerhalb des Dropdowns schließt Vorschläge
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Schnelle Filterung relevanter Vorschläge
  const filteredProfessions = useMemo(() => {
    const query = professionInput.trim().toLowerCase();
    if (query.length < 1) return [];
    return PROFESSIONS_DATA.filter((p) =>
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [professionInput]);

  if (!isOpen) return null;

  const isStep3Valid = professionInput.trim().length >= 2;

  // Validierung für 4 lineare Schritte
  const isCurrentStepValid = (): boolean => {
    switch (step) {
      case 1:
        return gender !== undefined;
      case 2:
        return faithStage !== undefined;
      case 3:
        return isStep3Valid;
      case 4:
        return relationshipStatus.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      // Abschluss nach Schritt 4
      const finalProfession = professionInput.trim();
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
        // Standard-Denktyp für schnellen Einstieg ohne Reibung:
        mindset: initialProfile?.mindset?.trim() || 'Lösungsorientiert & Pragmatisch',
        profession: finalProfession,
        professionDetail: '',
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

  const handleSelectSuggestion = (item: ProfessionItem) => {
    setProfessionInput(item.name);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header mit Fortschritt (4 Schritte) */}
        <div className="pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Verbindungsprofil einrichten
            </span>
            <span className="text-xs font-mono font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-stone-200/60 dark:border-slate-700/60">
              Schritt {step} von 4
            </span>
          </div>

          {/* 4-Segment Fortschrittsbalken */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((s) => (
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

              {/* Geschlecht (Pflicht) - Radikal entschlackt OHNE Vorurteile/Untertitel */}
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
                    className={`py-5 px-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-[#E09F3E]/15 border-[#E09F3E] shadow-md shadow-[#E09F3E]/10 ring-2 ring-[#E09F3E]/40'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">🧔</span>
                    <span className={`text-base font-bold ${gender === 'male' ? 'text-[#B45309] dark:text-[#FDE68A]' : 'text-stone-800 dark:text-stone-200'}`}>
                      Mann
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-5 px-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-[#E09F3E]/15 border-[#E09F3E] shadow-md shadow-[#E09F3E]/10 ring-2 ring-[#E09F3E]/40'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">👩</span>
                    <span className={`text-base font-bold ${gender === 'female' ? 'text-[#B45309] dark:text-[#FDE68A]' : 'text-stone-800 dark:text-stone-200'}`}>
                      Frau
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
              SCHRITT 3: RADIKAL-CLEANUP – 1 FELD, INFO-ICON (ℹ️), GRÜNES SOFORT-FEEDBACK
              ======================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                    Was ist dein Beruf oder Alltag?
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                    className="p-1 rounded-full text-stone-400 hover:text-[#E09F3E] hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Hinweis anzeigen"
                    aria-label="Info anzeigen"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Kompakte Info-Box bei Klick auf (ℹ️) */}
                {showInfoTooltip && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-700 dark:text-stone-300 space-y-1.5 animate-in fade-in duration-150">
                    <p className="font-medium text-[#B45309] dark:text-[#FDE68A]">
                      Es gibt kein Richtig oder Falsch!
                    </p>
                    <p className="leading-relaxed">
                      Schreibe einfach rein, was du machst – egal ob Beruf, Ausbildung, Mehrfachrolle oder Pause.
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                      Beispiele: ‚Küchenmonteur‘, ‚Hausfrau & Teilzeit Büro‘, ‚in Lehre als Elektriker‘, ‚arbeitssuchend‘.
                    </p>
                  </div>
                )}
              </div>

              {/* Smart Autocomplete Input – Nur 1 einziges Feld mit visuellem Feedback */}
              <div className="space-y-2" ref={dropdownRef}>
                <div className="relative">
                  <div className={`flex items-center px-3.5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                    isStep3Valid
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 dark:border-emerald-500/80'
                      : 'border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50 focus-within:border-[#E09F3E]'
                  }`}>
                    <Search className={`w-4 h-4 mr-2.5 shrink-0 transition-colors ${
                      isStep3Valid ? 'text-emerald-500' : 'text-stone-400'
                    }`} />
                    <input
                      type="text"
                      value={professionInput}
                      onChange={(e) => {
                        setProfessionInput(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => {
                        if (professionInput.trim().length >= 1) {
                          setIsDropdownOpen(true);
                        }
                      }}
                      placeholder="z. B. Küchenmonteur, Hausfrau & Teilzeit, in Lehre..."
                      className="w-full bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none"
                    />

                    {/* Visueller Bestätigungs-Haken bei Gültigkeit */}
                    {isStep3Valid && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg mr-1 shrink-0 animate-in fade-in duration-150">
                        <Check className="w-3.5 h-3.5" />
                        <span>Gültig</span>
                      </span>
                    )}

                    {professionInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfessionInput('');
                          setIsDropdownOpen(false);
                        }}
                        className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dynamisches Dropdown für Vorschläge */}
                  {isDropdownOpen && filteredProfessions.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-xl py-1.5 animate-in fade-in duration-150">
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        Vorschläge (antippen zum Übernehmen):
                      </div>
                      {filteredProfessions.map((item) => (
                        <button
                          type="button"
                          key={item.name}
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full text-left px-3.5 py-2 hover:bg-[#E09F3E]/10 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                        >
                          <span className="text-stone-800 dark:text-stone-200 font-medium group-hover:text-[#B45309] dark:group-hover:text-[#FDE68A]">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500">
                            {item.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SCHRITT 4: LEBENSRAHMEN (OHNE SUBTEXTE)
              ======================================================== */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
                  In welchem Lebensrahmen lebst du?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Steuert den lebenspraktischen Rahmen für Feierabend und Miteinander.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Verheiratet / Feste Partnerschaft', icon: '💍' },
                  { name: 'Single / Alleinlebend', icon: '👤' },
                  { name: 'Familie / Kinder im Haus', icon: '👨‍👧' },
                  { name: 'In Umbruch / Aufarbeitung', icon: '🌪️' },
                ].map((item) => {
                  const isSelected = relationshipStatus === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setRelationshipStatus(item.name)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E09F3E]/15 border-[#E09F3E] ring-2 ring-[#E09F3E]/40 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {item.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#E09F3E]" />}
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
              step === 3 && isStep3Valid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 active:scale-[0.98]'
                : isCurrentStepValid()
                ? 'bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] active:scale-[0.98]'
                : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{step === 4 ? 'Profil speichern & Lightflow starten' : 'Weiter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
