import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile } from '../types';
import { X, Check, Briefcase, Brain, Heart, Compass, Sparkles, Search, Plus, User } from 'lucide-react';
import { PROFESSIONS_DATA, ProfessionItem } from '../data/professionsData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const PRESET_MINDSETS = [
  'Lösungsorientiert & Analytisch',
  'Bildhaft & Praktisch',
  'Beziehungsorientiert & Feinfühlig',
  'Systemisch & Technisch hinterfragend',
];

const PRESET_RELATIONSHIPS = [
  'Single / Alleinlebend',
  'In Partnerschaft',
  'Familie mit Kindern',
  'Alleinerziehend',
];

const PRESET_JOURNEY_STAGES = [
  'Neugierig & Entdecker',
  'Erste Schritte / Neu unterwegs',
  'Schon länger auf dem Weg',
  'Im Zweifel & Sucht Antworten',
  'Müde & Ausgelaugt (Brauche Ruhe)',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Garantiert, dass geänderte Profile aus dem Storage/Props beim Öffnen immer synchronisiert sind
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setSearchTerm(profile.profession || '');
      setIsDropdownOpen(false);
    }
  }, [isOpen, profile]);

  // Klick außerhalb des Dropdowns schließt die Vorschläge
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filterung der Berufe ab 2 Zeichen
  const filteredProfessions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query.length < 2) return [];
    return PROFESSIONS_DATA.filter((p) =>
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchTerm]);

  // Finde den aktuell ausgewählten Beruf im Datensatz für die Spezialisierungs-Chips
  const matchedProfessionItem = useMemo(() => {
    const current = (formData.profession || '').toLowerCase().trim();
    if (!current) return null;
    return (
      PROFESSIONS_DATA.find((p) => p.name.toLowerCase() === current) ||
      PROFESSIONS_DATA.find((p) => current.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(current))
    );
  }, [formData.profession]);

  if (!isOpen) return null;

  const handleSelectProfession = (item: ProfessionItem) => {
    setFormData((prev) => ({ ...prev, profession: item.name }));
    setSearchTerm(item.name);
    setIsDropdownOpen(false);
  };

  const handleCustomProfessionBlur = () => {
    if (searchTerm.trim() && searchTerm.trim() !== formData.profession) {
      setFormData((prev) => ({ ...prev, profession: searchTerm.trim() }));
    }
  };

  const handleToggleChip = (chip: string) => {
    const currentDetail = formData.professionDetail || '';
    const parts = currentDetail.split(',').map((s) => s.trim()).filter(Boolean);
    let updatedDetail = '';

    if (parts.includes(chip)) {
      // Entfernen
      updatedDetail = parts.filter((p) => p !== chip).join(', ');
    } else {
      // Hinzufügen
      updatedDetail = parts.length > 0 ? `${parts.join(', ')}, ${chip}` : chip;
    }

    setFormData((prev) => ({ ...prev, professionDetail: updatedDetail }));
  };

  const isChipSelected = (chip: string) => {
    const currentDetail = formData.professionDetail || '';
    const parts = currentDetail.split(',').map((s) => s.trim().toLowerCase());
    return parts.includes(chip.toLowerCase());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      profession: searchTerm.trim() || formData.profession || 'Küchenmonteur / Handwerk',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#E09F3E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Nutzer-Matrix
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9] mt-0.5">
              Dein Verbindungsprofil
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 my-4 leading-relaxed">
          Lightflow übersetzt Passagen exakt in deine Denkweise und dein Berufsfeld – ohne fromme Schablonen. Die Daten bleiben vollständig auf deinem Gerät im Browser gespeichert.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Rufname / Vorname (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <User className="w-4 h-4 text-[#E09F3E]" />
              Dein Rufname / Vorname (optional)
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50 focus-within:border-[#E09F3E] transition-all">
              <input
                type="text"
                value={formData.displayName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                placeholder="z. B. Radovan"
                className="w-full bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Damit die Zusage dich persönlich und vertraut ansprechen kann.
            </p>
          </div>

          {/* 1. Beruf / Smartes Autocomplete */}
          <div className="space-y-3" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#E09F3E]" />
                1. Beruf & Erfahrungswelt
              </label>
              {formData.profession && (
                <span className="text-[11px] text-[#B45309] dark:text-[#FDE68A] font-medium truncate max-w-[200px]">
                  ✓ {formData.profession}
                </span>
              )}
            </div>

            {/* Autocomplete Input */}
            <div className="relative">
              <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#E09F3E]/50 focus-within:border-[#E09F3E] transition-all">
                <Search className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFormData((prev) => ({ ...prev, profession: e.target.value }));
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (searchTerm.trim().length >= 2) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  onBlur={handleCustomProfessionBlur}
                  placeholder="Tippe deinen Beruf (z. B. Pilot, Pflege, Monteur, Lehrer)..."
                  className="w-full bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setFormData((prev) => ({ ...prev, profession: '' }));
                      setIsDropdownOpen(false);
                    }}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && filteredProfessions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-[#1a222d] border border-stone-200 dark:border-slate-700 shadow-xl py-1.5 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 border-b border-stone-100 dark:border-slate-800">
                    Vorschläge ({filteredProfessions.length})
                  </div>
                  {filteredProfessions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelectProfession(item)}
                      className="w-full text-left px-3.5 py-2 hover:bg-amber-500/10 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-medium text-stone-800 dark:text-stone-100 group-hover:text-[#B45309] dark:group-hover:text-[#FDE68A]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {item.category}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#E09F3E] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Auswählen ➔
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamische Spezialisierungs-Chips für den gewählten Beruf */}
            {matchedProfessionItem && matchedProfessionItem.chips.length > 0 && (
              <div className="pt-1 animate-in fade-in duration-200">
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1.5">
                  Praxis-Spezialisierungen für {matchedProfessionItem.name} (antippen zum Übernehmen):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedProfessionItem.chips.map((chip) => {
                    const selected = isChipSelected(chip);
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => handleToggleChip(chip)}
                        className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                          selected
                            ? 'bg-[#E09F3E] text-slate-950 border-[#E09F3E] font-semibold shadow-xs'
                            : 'bg-stone-100 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-800 hover:border-[#E09F3E]/40 hover:text-stone-800 dark:hover:text-stone-200'
                        }`}
                      >
                        {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                        <span>{chip}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Freitext-Feld für die genaue Tätigkeit */}
            <div className="pt-1">
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                Genaue Tätigkeit & Alltag (Freitext für echte Praxis-Metaphern):
              </label>
              <input
                type="text"
                value={formData.professionDetail ?? ''}
                onChange={(e) => setFormData({ ...formData, professionDetail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                placeholder="z. B. Langstrecke / Nachtflug oder Endmontage im Altbau..."
              />
            </div>
          </div>

          {/* 2. Denkweise */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#E09F3E]" />
              2. Dein Denkstil
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_MINDSETS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setFormData({ ...formData, mindset: m })}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    formData.mindset === m
                      ? 'bg-[#E09F3E]/15 border-[#E09F3E] text-[#92400E] dark:text-[#FDE68A] font-semibold'
                      : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Lebenssituation */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E09F3E]" />
              3. Lebenssituation & Feierabend
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_RELATIONSHIPS.map((rel) => (
                <button
                  type="button"
                  key={rel}
                  onClick={() => setFormData({ ...formData, relationshipStatus: rel })}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    formData.relationshipStatus === rel
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]'
                      : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-slate-800'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          {/* 4. DEIN WEG MIT JESUS */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#E09F3E]" />
              4. DEIN WEG MIT JESUS
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_JOURNEY_STAGES.map((stage) => {
                const isSelected = (formData.journeyStage || formData.faithStage) === stage;
                return (
                  <button
                    type="button"
                    key={stage}
                    onClick={() => setFormData({ ...formData, journeyStage: stage, faithStage: stage })}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3E6B56]/20 text-[#2A483A] dark:text-[#A7F3D0] border-[#3E6B56] font-medium'
                        : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-slate-800'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Aktionen */}
          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#E09F3E] hover:bg-[#D97706] text-slate-900 shadow-md shadow-[#E09F3E]/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Profil anwenden</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
