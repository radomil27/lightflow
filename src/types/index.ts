/**
 * Lightflow - TypeScript Typdefinitionen
 * Definiert das Verbindungsprofil ("User Matrix") und die 6-Stufen-Report-Struktur
 */

export type Gender = 'male' | 'female';
export type FaithStage = 'seeker' | 'disciple' | 'exhausted';

export interface UserProfile {
  displayName?: string;      // Optionaler persönlicher Rufname / Vorname (z.B. "Radovan")
  gender?: Gender;           // 'male' | 'female' (Pflichtauswahl im Onboarding)
  faithStage?: FaithStage | string; // 'seeker' | 'disciple' | 'exhausted' (abwärtskompatibel)
  journeyStage?: string;     // Abwärtskompatibel
  profession: string;        // z.B. "Handwerk, Montage & Bau", "Büro, IT & Verwaltung", "Pflege"
  professionDetail?: string;  // Freitext für genaue Tätigkeit (z.B. "Küchenmonteur für anspruchsvolle Endmontage")
  mindset: string;           // "Analytisch & Lösungsorientiert", "Emotional & Beziehungsorientiert", etc.
  relationshipStatus: string;// "Verheiratet / Feste Partnerschaft", "Single / Alleinlebend", etc.
  dailyMood?: string;        // "Unter Druck / Erschöpft", "Suche Klarheit", "Dankbar"
  hasCompletedOnboarding?: boolean; // Kennzeichen für abgeschlossenes Onboarding
}

export interface LightflowReport {
  id: string;
  passage: string;
  timestamp: number;
  profileSnapshot: UserProfile;
  mood: string;
  
  // Die 7 Posten des Lightflow-Reports
  lichtfunke: string;        // 1. LICHTFUNKE (Jesus spricht direkt, warmherzig auf Augenhöhe)
  klarblick: string;         // 2. KLARBLICK (Erklärung angepasst an Denkstil, logische Funktionsweise)
  tagwerk: string;           // 3. TAGWERK (Übertragung auf Beruf & Arbeitsalltag mit konkreter Handlung)
  freiraum: string;          // 4. FREIRAUM (Feierabend, Erholung, Druck abbauen ohne schlechtes Gewissen)
  standpunkt: string;        // 5. STANDPUNKT (Lebenssituation / Zivilstand, Umgang mit Mitmenschen)
  spiegel: string;           // 6. SPIEGEL (Miteinander/Gemeinschaft + 2-3 Reflexionsfragen im Stillen)
  leuchtkraft: string;       // 7. LEUCHTKRAFT (Der Garten im Herzen, Gnade ohne Leistung + Herzensgebet)
  
  // Legacy-Kompatibilität für ältere gespeicherte Reports
  coreConduit?: string;
  workBench?: string;
  systemDecoded?: string;
  dailyFreedom?: string;
  heartGarden?: string;
  oxygenMask?: string;

  favorite?: boolean;
  notes?: string;
  isFallback?: boolean;
  source?: 'gemini' | 'local_fallback';
  fallbackReason?: string;
  // Status für sequentielle Generierung (1..7): 'loading' | 'ready' | 'error'
  sectionLoadingStates?: Record<number, 'loading' | 'ready' | 'error'>;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize?: 'sm' | 'md' | 'lg';
  bibleTranslation?: 'SCH' | 'LUT';
  customApiKey?: string;
  apiProvider?: 'gemini' | 'openai';
  selectedModel?: string;
  // Optionale Sprachausgabe mit eigenem API-Key
  speechEnabled?: boolean;
  speechProvider?: 'google' | 'openai';
  speechApiKey?: string;
  speechModel?: string;
}

export interface InspirationPassage {
  title: string;
  passage: string;
  tagline: string;
  recommendedFor: string;
}

export interface AppUser {
  id: string;
  name: string;
  referral_code: string;
  referred_by_code?: string | null;
  reports_count: number;
  last_active_at: string;
  created_at: string;
}

export interface AppFeedback {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'resolved';
}
