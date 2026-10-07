import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  UserCheck,
  Share2,
  Ban,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [showLegalDetails, setShowLegalDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-stone-50 dark:bg-stone-950 border border-[#E5E0D8] dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                Datenschutz & Grundsätze
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                CH-DSG & DSGVO konform • Transparenz für deine Stille Zeit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
          
          {/* Section A: Auf einen Blick */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FDE68A] mb-3">
              Auf einen Blick: Unsere festen Versprechen
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    Deine Stille Zeit bleibt privat
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Deine gelesenen Bibelverse, persönlichen Gedanken, Gebete und Notizen werden <strong>ausschließlich lokal auf deinem Smartphone</strong> gespeichert. Niemand außer dir kann sie lesen.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    Nur dein Vorname
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Zur persönlichen Ansprache speichern wir lediglich deinen Rufnamen. Keine Pflicht zu E-Mail-Adresse oder Passwort.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#E09F3E] shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    Transparente Weitergabe
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Wir erfassen, wer dich eingeladen hat und ob die App aktiv genutzt wird, um das Wachstum und die Gemeindearbeit gezielt zu unterstützen.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    Keine Werbung, kein Verkauf
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Deine Daten werden niemals verkauft, nicht profiliert und zu keinem Zeitpunkt für Werbezwecke analysiert.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Rechtlicher Volltext (Ausklappbar) */}
          <div className="pt-2 border-t border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowLegalDetails(!showLegalDetails)}
              className="w-full p-3 rounded-2xl bg-stone-100/80 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 flex items-center justify-between text-left hover:border-stone-300 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-stone-800 dark:text-stone-200 font-semibold">
                <FileText className="w-4 h-4 text-[#E09F3E]" />
                <span>Ausführlicher Rechtstext (DSGVO / Schweizer DSG)</span>
              </div>
              {showLegalDetails ? (
                <ChevronUp className="w-4 h-4 text-stone-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {showLegalDetails && (
              <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-stone-200/80 dark:border-slate-800 space-y-3 text-[11px] text-stone-600 dark:text-stone-300 animate-in fade-in-50">
                <div>
                  <strong className="text-stone-900 dark:text-stone-100">1. Verantwortliche Stelle:</strong>
                  <p className="mt-0.5">
                    Verantwortlich für den Betrieb dieser Anwendung ist das Lightflow-Projektteam. Anfragen können jederzeit über den integrierten Feedback-Kanal gestellt werden.
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-stone-100">2. Lokale Datenspeicherung (LocalStorage & IndexedDB):</strong>
                  <p className="mt-0.5">
                    Als Progressive Web App (PWA) speichert Lightflow persönliche Verbindungsprofile, individuelle Notizen, Gebete und generierte Auswertungen ausschließlich im lokalen Speicher deines Endgeräts. Diese Daten verlassen dein Gerät zu keinem Zeitpunkt in unverschlüsselter oder fremdzugänglicher Form.
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-stone-100">3. Empfehlungs-System & minimale Telemetrie:</strong>
                  <p className="mt-0.5">
                    Beim freiwilligen Öffnen über einen Empfehlungs-Link erfassen wir den zugeordneten Referral-Code, deinen frei wählbaren Rufnamen, die Anzahl generierter Berichte sowie den Zeitstempel des letzten Aufrufs. Dies dient dem Nachweis der aktiven Begleitung. Inhalte deiner Berichte werden dabei niemals übertragen.
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-stone-100">4. KI-Verarbeitung (Google Gemini / OpenAI):</strong>
                  <p className="mt-0.5">
                    Zur Auslegung der Bibeltexte werden Passagen und abstrakte Lebensrahmen an die zuständige KI-Schnittstelle gesendet. Es erfolgt keine Verknüpfung mit Klarnamen, Adressen oder Telefonnummern. Die Anbieter verwenden API-Daten nicht zum Training ihrer Modelle.
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-stone-100">5. Betroffenenrechte & Löschung:</strong>
                  <p className="mt-0.5">
                    Du hast jederzeit das Recht auf Auskunft, Berichtigung und Löschung. Durch Klick auf „App-Cache leeren“ in den Einstellungen oder Löschen der Websitedaten in deinem Browser werden sämtliche lokalen Daten sofort restlos von deinem Gerät entfernt.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-stone-950 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold bg-[#E09F3E] text-slate-950 hover:bg-[#D97706] rounded-xl transition-all cursor-pointer shadow-sm text-center"
          >
            Verstanden & Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
