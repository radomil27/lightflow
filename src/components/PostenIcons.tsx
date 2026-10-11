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
 * Die Tat, Handwerk & Schöpfungswerkzeuge für den Herrn
 * Klassischer, massiver Zimmermannshammer
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
    {/* Hammerkopf */}
    <path d="M15 2L21 8L18 11L16 9L9 16L7 14L14 7L12 5L15 2Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M15 2L21 8" strokeWidth="2" />
    <path d="M18 11L12 5" />
    {/* Hammerstiel */}
    <path d="M9 16L3 22" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M8 15L2 21" strokeWidth="1.2" strokeOpacity="0.5" />
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
 * Der feste Anker der Seele (Hebräer 6,19)
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
    {/* Anker-Ring oben */}
    <circle cx="12" cy="5" r="2.5" strokeWidth="1.8" />
    {/* Schaft des Ankers */}
    <path d="M12 7.5V21" strokeWidth="2" />
    {/* Querstrebe des Ankers */}
    <path d="M7 10.5H17" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="10.5" r="1" fill="currentColor" />
    <circle cx="17" cy="10.5" r="1" fill="currentColor" />
    {/* Geschwungener Ankerbogen mit Flunken */}
    <path d="M4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14" strokeWidth="2" strokeLinecap="round" />
    <path d="M2.5 15L4 14L5.5 15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 15L20 14L21.5 15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
 * Herzensgebet & Hingabe / Betende Hände vor Gott (Gebetsicon)
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
    {/* Betende Hände (Folded / Praying Hands) */}
    <path
      d="M12 3C11.5 4 11 6 10 9L8 13C7 15 7.5 17 9 19L12 21L15 19C16.5 17 17 15 16 13L14 9C13 6 12.5 4 12 3Z"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <path d="M12 3V21" strokeWidth="1.8" />
    <path d="M10 9L7 14C6 16 6.5 18 8 20L12 21" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 9L17 14C18 16 17.5 18 16 20L12 21" strokeWidth="1.8" strokeLinecap="round" />
    {/* Lichtstrahlen / Aura des Gebets über den Händen */}
    <path d="M12 1V2.5M7.5 3.5L8.5 4.5M16.5 3.5L15.5 4.5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
