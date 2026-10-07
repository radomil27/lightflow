import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Users,
  MessageSquare,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Share2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { AppUser, AppFeedback } from '../types';
import {
  fetchAdminUsers,
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  deleteAdminFeedback,
} from '../services/adminService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PIN = '7777'; // Feste Admin-PIN für geschützten Zugang

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'users' | 'feedback'>('users');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lade Daten wenn PIN authentifiziert ist
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [u, f] = await Promise.all([fetchAdminUsers(), fetchAdminFeedbacks()]);
      setUsers(u);
      setFeedbacks(f);
    } catch (e) {
      console.warn('Admin load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleToggleFeedbackStatus = async (id: string, current: string) => {
    const next = current === 'resolved' ? 'new' : 'resolved';
    await updateFeedbackStatus(id, next as any);
    setFeedbacks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: next as any } : item))
    );
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm('Feedback-Eintrag wirklich löschen?')) {
      await deleteAdminFeedback(id);
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const isToday = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Find Referrer Name for a given user
  const getReferrerName = (referredByCode?: string | null) => {
    if (!referredByCode) return 'Direkt / Organisch';
    const match = users.find((u) => u.referral_code === referredByCode);
    return match ? `${match.name} (${referredByCode})` : referredByCode;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Lightflow Admin-Board</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold">
                  Intern
                </span>
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Nutzer, Weiterempfehlungen & Feedback-Übersicht
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-[#E09F3E]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">
                Admin-Zugangscode eingeben
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Dieser Bereich ist den Initiatoren von Lightflow vorbehalten (PIN: 7777).
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN eingeben..."
                autoFocus
                className="w-full text-center text-lg tracking-widest font-mono py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#E09F3E]"
              />
              {pinError && (
                <div className="text-xs text-rose-500 font-medium">
                  Falsche PIN. Bitte erneut versuchen.
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E09F3E] text-slate-950 font-semibold text-xs hover:bg-[#D97706] transition-all cursor-pointer shadow-sm"
              >
                Entsperren
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Tabs & Refresh */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 dark:border-slate-800 bg-stone-100/60 dark:bg-slate-900/40">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-slate-700'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#E09F3E]" />
                  <span>Nutzer & Empfehlungen ({users.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'feedback'
                      ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-slate-700'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  <span>Feedback-Eingang ({feedbacks.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Aktualisieren"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Tab 1: Users & Referrals */}
            {activeTab === 'users' && (
              <div className="p-5 overflow-y-auto space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-stone-400">Registrierte Rufnamen</div>
                    <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">
                      {users.length}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-stone-400">Heute aktiv</div>
                    <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {users.filter((u) => isToday(u.last_active_at)).length} Nutzer
                    </div>
                  </div>
                </div>

                <div className="border border-stone-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 dark:text-stone-400 text-[10px] uppercase tracking-wider border-b border-stone-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Rufname</th>
                          <th className="py-2.5 px-3">Eingeladen durch</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Berichte</th>
                          <th className="py-2.5 px-3 text-right">Zuletzt aktiv</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-slate-800/60">
                        {users.map((u) => {
                          const activeToday = isToday(u.last_active_at);
                          return (
                            <tr key={u.id} className="hover:bg-stone-50/50 dark:hover:bg-slate-800/30">
                              <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100">
                                <div className="flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  <span className="font-mono text-[10px] text-stone-400 font-normal">
                                    ({u.referral_code})
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                                <span className="inline-flex items-center gap-1">
                                  <Share2 className="w-3 h-3 text-[#E09F3E]" />
                                  <span>{getReferrerName(u.referred_by_code)}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    activeToday
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-stone-200/60 dark:bg-slate-800 text-stone-500'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      activeToday ? 'bg-emerald-500' : 'bg-stone-400'
                                    }`}
                                  />
                                  <span>{activeToday ? 'Heute aktiv' : 'Inaktiv'}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-medium text-stone-700 dark:text-stone-300">
                                <span className="inline-flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-stone-400" />
                                  <span>{u.reports_count}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right text-[11px] text-stone-400">
                                {formatDate(u.last_active_at)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Feedbacks */}
            {activeTab === 'feedback' && (
              <div className="p-5 overflow-y-auto space-y-3">
                {feedbacks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-400">
                    Noch keine Rückmeldungen vorhanden.
                  </div>
                ) : (
                  feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        fb.status === 'resolved'
                          ? 'bg-stone-100/60 dark:bg-slate-900/40 border-stone-200/60 dark:border-slate-800 opacity-60'
                          : 'bg-white dark:bg-slate-900 border-stone-200/80 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800/80 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-stone-900 dark:text-stone-100">
                            {fb.user_name}
                          </span>
                          <span className="text-[10px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(fb.created_at)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              fb.status === 'resolved'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{fb.status === 'resolved' ? 'Erledigt' : 'Abhaken'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(fb.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                        {fb.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-stone-950 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-200 dark:bg-slate-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
