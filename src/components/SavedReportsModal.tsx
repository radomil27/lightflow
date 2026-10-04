import React, { useState } from 'react';
import { LightflowReport } from '../types';
import { X, Bookmark, Trash2, ArrowRight, Search, Clock, Briefcase } from 'lucide-react';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: LightflowReport[];
  onSelectReport: (report: LightflowReport) => void;
  onDeleteReport: (id: string) => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  if (!isOpen) return null;

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.passage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.coreConduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.profileSnapshot.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = onlyFavorites ? r.favorite : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#FAF9F6] dark:bg-[#151B22] border border-[#E5E0D8] dark:border-slate-800 shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#E09F3E]" />
            <h2 className="text-xl font-bold font-serif text-[#1E293B] dark:text-[#F1F5F9]">
              Gespeicherte Lichtflüsse ({reports.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Suche */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nach Bibelstelle, Thema oder Beruf filtern..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#E09F3E]/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOnlyFavorites(false)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                !onlyFavorites
                  ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-medium'
                  : 'bg-white dark:bg-slate-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-800'
              }`}
            >
              Alle Berichte ({reports.length})
            </button>
            <button
              onClick={() => setOnlyFavorites(true)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                onlyFavorites
                  ? 'bg-[#E09F3E]/20 text-[#B45309] dark:text-[#FDE68A] border-[#E09F3E] font-medium'
                  : 'bg-white dark:bg-slate-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-slate-800'
              }`}
            >
              Nur Favoriten ({reports.filter((r) => r.favorite).length})
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-xs">
              Keine passenden Berichte gefunden.
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800/80 hover:border-[#E09F3E]/50 transition-all shadow-sm flex items-start justify-between gap-3"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectReport(r);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 font-serif text-sm">
                      {r.passage}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#E09F3E]" />
                      {r.profileSnapshot.profession}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic font-serif">
                    „{r.coreConduit}“
                  </p>
                </div>

                <div className="flex items-center space-x-1 shrink-0 pt-1">
                  <button
                    onClick={() => onDeleteReport(r.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Bericht löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectReport(r);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-[#E09F3E] hover:bg-[#E09F3E]/10 transition-colors cursor-pointer"
                    title="Öffnen"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
