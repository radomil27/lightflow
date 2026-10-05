import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { X, Check, Briefcase, Brain, Heart, Compass, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const PRESET_PROFESSIONS = [
  'Küchenmonteur / Handwerk',
  'IT & Software-Entwicklung',
  'Pflege & Gesundheitswesen',
  'Schreiner & Möbelbau',
  'Bauleiter & Koordinator',
  'Lehrkraft & Pädagogik',
  'Kaufmännisch & Projektleitung',
];

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

  // Garantiert, dass geänderte Profile aus dem Storage/Props beim Öffnen immer synchronisiert sind
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 my-4 leading-relaxed">
          Lightflow übersetzt Passagen exakt in deine Denkweise und dein Berufsfeld – ohne fromme Schablonen. Die Daten bleiben vollständig auf deinem Gerät im Browser gespeichert.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Beruf / Fachmetaphern */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#E09F3E]" />
              1. Beruf & Erfahrungswelt
            </label>
            
            {/* Grobauswahl-Chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROFESSIONS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, profession: p })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    formData.profession === p
                      ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E]/50 font-medium'
                      : 'bg-stone-100 dark:bg-slate-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-800 hover:border-[#E09F3E]/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

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
                placeholder="z. B. Küchenmonteur für Endmontage, Servicetechniker im Aussendienst..."
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
