import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * 1. LICHTFUNKE ICON
 * Die königliche Zusage / Der erste göttliche Lichtstrahl & Funke am Morgen
 * 8-zackiger Stern von Bethlehem / Aurora mit feinem Lichtkern
 */
export const IconLichtfunke: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Hauptstrahlen des Lichtfunkens */}
    <path d="M12 2V6M12 18V22M2 12H6M18 12H22" />
    {/* Diagonale Funkenstrahlen */}
    <path d="M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
    {/* Konzentrischer Kristall-Kern */}
    <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * 2. KLARBLICK ICON
 * Falsch vs. Echt (Die Entlarvung) / Geistliche Unterscheidung & Weitsicht
 * Edles Auge der Wahrheit / Kristalllinse mit Fokuskreuz
 */
export const IconKlarblick: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Klares Prisma / Augen-Mandorla */}
    <path d="M2.5 12C4.5 7.5 8 4.5 12 4.5C16 4.5 19.5 7.5 21.5 12C19.5 16.5 16 19.5 12 19.5C8 19.5 4.5 16.5 2.5 12Z" />
    {/* Kristalline Pupille */}
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    {/* Lichtreflex / Klarheitsstrahl */}
    <circle cx="13" cy="11" r="1" fill="currentColor" />
    {/* Subtile Achsen der Wahrheit */}
    <path d="M12 2V4M12 20V22" strokeWidth="1.5" strokeOpacity="0.6" />
  </svg>
);

/**
 * 3. TAGWERK ICON
 * Fleisch vs. Geist (Die Tat) / Handwerk, Pflug & Werkbank für den Herrn
 * Zwei gekreuzte Edelhämmer / Werkzeuge der Schöpfung mit Weizenkorn
 */
export const IconTagwerk: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Zimmermanns-Hammer & Meißel der Schöpfung */}
    <path d="M14.5 2.5L21.5 9.5M16 4L19 7M16.5 4.5L8.5 12.5C7.5 13.5 6.5 14 5 14L2 14L2 17L5 17C6.5 17 7.5 17.5 8.5 18.5L9.5 19.5" />
    <path d="M7 17L3 21" strokeWidth="2" />
    {/* Amboss-Horizontale der Beständigkeit */}
    <path d="M10 10L14 14" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * 4. FREIRAUM ICON
 * Dienst statt Opfer-Haltung / Sabbat-Ruhe, Weite & Entlastung
 * Offenes Himmelszelt / Entfaltete Tauben-Schwingen des Friedens
 */
export const IconFreiraum: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Aufsteigende Schwingen in die Freiheit */}
    <path d="M3 14C5 8 9 5 12 7C15 5 19 8 21 14" />
    <path d="M12 7V19" strokeWidth="1.8" />
    {/* Geöffneter Horizont / Weite */}
    <path d="M5 19H19" strokeWidth="1.5" strokeDasharray="2 3" />
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * 5. STANDPUNKT ICON
 * Fels statt Wind / Standfestigkeit, Fundament & Ausrichtung
 * Der Felsen von Horeb / Ein unerschütterlicher Eckstein mit Anker
 */
export const IconStandpunkt: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Massiver Eckstein / Schild-Fundament */}
    <path d="M12 2L4 6V12C4 17.5 7.5 21 12 22C16.5 21 20 17.5 20 12V6L12 2Z" />
    {/* Fundament-Kreuz im Felsen */}
    <path d="M12 7V16M8.5 10.5H15.5" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 6. SPIEGEL ICON
 * Herzensprüfung & Umkehr / Der ehrliche Spiegel des Wortes Gottes
 * Reines Wasserbecken / Kristallspiegel mit introspektiver Reflektion
 */
export const IconSpiegel: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Ovaler Spiegel der Wahrheit */}
    <ellipse cx="12" cy="11" rx="8" ry="9" />
    {/* Standfuß des Prüfsteins */}
    <path d="M12 20V22M8 22H16" strokeWidth="1.8" />
    {/* Diagonaler Lichtreflex auf der Spiegelfläche */}
    <path d="M9 7L15 15M14 6L16 8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
  </svg>
);

/**
 * 7. LEUCHTKRAFT ICON
 * Feste Entscheidung & Hingabe / Ewige Flamme, Herzensaltar & Leuchtturm
 * Die brennende Bundesflamme & Menora-Feuer auf dem Wasser
 */
export const IconLeuchtkraft: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Die lebendige Bundesflamme */}
    <path d="M12 2C12 2 15.5 6.5 15.5 10.5C15.5 12.5 14.5 14.5 12 15C9.5 14.5 8.5 12.5 8.5 10.5C8.5 7.5 10.5 4.5 12 2Z" fill="currentColor" fillOpacity="0.2" />
    {/* Äußere Flammenkrone */}
    <path d="M12 2C8.5 6 6 10.5 6 14.5C6 18.5 9 22 12 22C15 22 18 18.5 18 14.5C18 10 15 6 12 2Z" />
    {/* Glühender Flammenkern */}
    <path d="M12 16V19" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
