/**
 * Lightflow - TypeScript Typdefinitionen
 * Definiert das Verbindungsprofil ("User Matrix") und die 6-Stufen-Report-Struktur
 */

export interface UserProfile {
  profession: string;        // z.B. "Küchenmonteur / Handwerk", "IT & Code", "Pflege"
  mindset: string;           // "Lösungsorientiert & Analytisch", "Bildhaft", "Beziehungsorientiert"
  relationshipStatus: string;// "Single / Alleinlebend", "Partnerschaft", "Familie"
  faithStage: string;        // "Hinterfragend", "Auf der Suche", "Tief verwurzelt"
  dailyMood?: string;        // "Unter Druck / Erschöpft", "Suche Klarheit", "Dankbar"
}

export interface LightflowReport {
  id: string;
  passage: string;
  timestamp: number;
  profileSnapshot: UserProfile;
  mood: string;
  
  // Die 6 Stufen des Lightflow-Reports
  coreConduit: string;       // 1. Die Kernleitung (Der Impuls): 1-2 glasklare Sätze
  workBench: string;         // 2. Die Werkbank (Berufs- & Alltags-Analogie)
  systemDecoded: string;     // 3. Das System entschlüsselt (Für den Denker): Fehlerdiagnose vs. göttliches Prinzip
  dailyFreedom: string;      // 4. Freiraum im Alltag (Privatleben): Feierabend, Erwartungen, Alleinleben
  heartGarden: string;       // 5. Der Garten im Herzen (Auftanken an der Quelle): Leistungsdruck ablegen
  oxygenMask: string;        // 6. Die Sauerstoffmaske (Herzensgebet): Ehrlich, unfromm, befreiend
  
  favorite?: boolean;
  notes?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  customApiKey?: string;
  apiProvider?: 'gemini' | 'openai';
  selectedModel?: string;
}

export interface InspirationPassage {
  title: string;
  passage: string;
  tagline: string;
  recommendedFor: string;
}
