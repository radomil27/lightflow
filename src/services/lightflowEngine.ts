/**
 * Lightflow KI-Prompt-Engine
 * 
 * Verarbeitet die Anfrage des Nutzers, speist die Nutzer-Matrix
 * in den System-Prompt ein und liefert den 6-Stufen-Report zurück.
 * Bietet native LLM-Integration (Google Gemini / OpenAI) sowie eine
 * tiefgehende, feinfühlige Offline-Engine für sofortigen Genuss ohne API-Zwang.
 */

import { UserProfile, LightflowReport, AppSettings } from '../types';

export function buildSystemPrompt(profile: UserProfile, passage: string, mood?: string): string {
  const userGender = profile.gender === 'female' ? 'female' : 'male';
  const genderLabel = userGender === 'female' ? 'Frau' : 'Mann';

  const rawFaithStage = (profile.faithStage || profile.journeyStage || '').toLowerCase();
  const faithStageKey: 'seeker' | 'disciple' | 'exhausted' =
    rawFaithStage.includes('such') || rawFaithStage.includes('zweifel') || rawFaithStage === 'seeker'
      ? 'seeker'
      : rawFaithStage.includes('müde') || rawFaithStage.includes('ausgelaugt') || rawFaithStage.includes('ausgebrannt') || rawFaithStage === 'exhausted'
      ? 'exhausted'
      : 'disciple';

  const faithStageLabel =
    faithStageKey === 'seeker'
      ? 'Am Suchen & Zweifeln (Fundamentsuche, Skepsis)'
      : faithStageKey === 'exhausted'
      ? 'Müde & Ausgebrannt (Braucht Gnade & Entlastung)'
      : 'Mitten im Alltag & Nachfolge (Ringen Fleisch vs. Geist, Gehorsam)';

  const currentMood = mood || profile.dailyMood || 'Suche Klarheit';
  const fullProfession = profile.professionDetail && profile.professionDetail.trim().length > 0
    ? `${profile.profession} (Konkrete Tätigkeit & Alltag: ${profile.professionDetail.trim()})`
    : profile.profession;
  const userName = profile.displayName && profile.displayName.trim().length > 0
    ? profile.displayName.trim()
    : null;

  return `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN (UNSICHTBARER MASSANZUG):
${userName ? `- Vorname / Rufname: ${userName}\n` : ''}- Geschlecht: ${genderLabel}
- Glaubensphase: ${faithStageLabel}
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Heutige Tagesverfassung: ${currentMood}

GANZHEITLICHE PERSÖNLICHKEITS-SYNTHESE (VOR DER GENERIERUNG DURCHFÜHREN):
1. STRIKTE TEXTTREUE & KLARE KANTE (ABSOLUTE PRIORITÄT):
   - Der eingegebene Bibeltext (${passage}) bestimmt das Thema, die Schärfe und die Tonalität.
   - KEIN generischer Wellness-Einheitsbrei: Wenn der Text warnt (z. B. vor Heuchelei, Habgier, Trägheit, falscher Sicherheit), decke die Warnung schonungslos und klar auf. Wenn der Text tröstet, tröste. Wenn der Text zur Umkehr oder Tat ruft, formuliere einen klaren Handlungsauftrag.
   - Beziehe jede Aussage, jedes Bild und jedes Gebet direkt auf den Inhalt, die Personen und die Ereignisse dieser konkreten Bibelstelle.
2. VERBOT VON LEBENSRATGEBER-FLOSKELN:
   - Formuliere KEINE psychologischen Coaching-Tipps, Achtsamkeits-Ratschläge oder säkularen Motivationssprüche (z. B. kein 'atme tief durch', kein 'achte auf deine Selbstfürsorge', kein 'gönn dir Pausen um Kraft zu schöpfen', kein Wellness-Vokabular).
   - Lightflow ist kein Lebenshilfe-Blog, sondern ein geistliches Werkzeug: Du bist Schriftausleger und geistlicher Wegweiser, der das Wort Gottes unverfälscht erklärt.
   - Jede praktische Anwendung MUSS zwingend und logisch aus der biblischen Aussage des Verses abgeleitet sein (Indikativ führt zum Imperativ: Weil Gott so ist / weil Christus das getan hat, handeln wir so).
3. GESCHLECHTSSPEZIFISCHE FÜHRUNG (${genderLabel.toUpperCase()}):
   ${userGender === 'male' ? `- Der Nutzer ist ein MANN:
     - Fokus auf Selbstbeherrschung statt Wut, Trotz oder verletztem Ego.
     - Wahre Männlichkeit als königliche Stärke durch Demut, Dienen und Treue zu Gottes Wort.
     - Verantwortung tragen, Fels in der Brandung sein, kein Jammern und keine Opfer-Haltung.` : `- Die Nutzerin ist eine FRAU:
     - Fokus auf innere Ruhe und Vertrauen statt Grübeln, Kontrollzwang oder Getriebenheit.
     - Echte Würde in Christus statt Anpassung an Erwartungen anderer Menschen.
     - Klare Grenzen in Liebe setzen, emotionale Lasten an Gott abgeben, geborgene Stärke.`}
4. PHASEN-STEUERUNG DER GLAUBENSPHASE (${faithStageKey.toUpperCase()}):
   ${faithStageKey === 'seeker' ? `- Phase SEEKER (Am Suchen & Zweifeln): Kein theologischer Insider-Jargon. Fokus auf logische Erklärung, biblische Fakten und den Beweis im echten Leben.` : faithStageKey === 'exhausted' ? `- Phase EXHAUSTED (Müde & Ausgebrannt): Fokus auf Gnade, das vollbrachte Werk Christi am Kreuz und Ablegen fremder Lasten. Baue KEINE moralischen Forderungen oder Druck auf; schenke geistlichen Sauerstoff.` : `- Phase DISCIPLE (Mitten im Alltag & Nachfolge): Konkrete Szenarien mit Vorher-Nachher-Kontrast (Altes Fleisch vs. Neuer Geist), klare wörtliche Rede und greifbare Gehorsamsschritte.`}
5. PERSÖNLICHE ANREDE & NAMENS-DOSIERUNG:
   ${userName ? `- Der Nutzer heißt ${userName}. Jesus darf den Nutzer in Posten 1 (LICHTFUNKE) genau EINMAL zu Beginn persönlich beim Vornamen ansprechen (z. B. 'Komm erst einmal an, ${userName}...').
   - In den übrigen Posten (2 bis 6) wird der Name NICHT künstlich wiederholt (keine ständige Nennung wie ein Verkäufer).
   - In Posten 7 (Gebet) spricht der Nutzer zu Gott – dort wird der eigene Name ebenfalls NICHT genannt.` : '- Es ist kein Vorname hinterlegt. Sprich den Nutzer direkt mit „du“ / „dir“ an, ohne künstliche Anrede.'}
6. SPRACHE & ARGUMENTATION: Der Denkstil (${profile.mindset}) bestimmt, WIE du sprichst.
   - Pragmatisch/Lösungsorientiert/Analytisch: Direkte Kausalität, schnörkellose Sätze, praktische Logik statt verschachtelter Poesie.
   - Bildhaft/Emotional/Beziehungsorientiert: Warme Vergleiche, emotionale Resonanz und Raum zum Fühlen.
7. BEZIEHUNGSRAUM: Der Lebensstand (${profile.relationshipStatus}) bestimmt den lebenspraktischen Rahmen.
   - Familie/Kinder: Wenig Zeit für sich, Trubel, Verantwortung, Erwartungsdruck von außen.
   - Single/Alleinlebend: Die Stille der eigenen vier Wände am Abend, Autonomie, das Verarbeiten des Tages ohne Gegenüber.
8. METAPHERN-INTELLIGENZ & POSTEN 3 REGEL:
   - Nutze das Berufsfeld (${fullProfession}) als intuitive Metaphernquelle. Verwende die spezifischen Fachbegriffe, Werkzeuge, Handgriffe und typischen Reibungspunkte dieser Branche organisch im Text (ohne Belehrung).
   - Baue in Posten 3 zwingend ein handfestes Merk-Bild / Werkzeug ein und stelle das konkrete Alltagsszenario dar (Reaktion im Fleisch vs. Handeln im Geist mit theologischem Warum).
9. MULTIDIMENSIONALE TEXT-ANALYSE & BIBLISCHE KAUSALKETTE:
   BIBLISCHE TEXT-DIMENSIONEN:
   Analysiere die gegebene Bibelstelle (${passage}) vorab auf ihre enthaltenen Wirkkräfte. Identifiziere primäre und sekundäre Dimensionen aus dem 7-teiligen Spektrum der Schrift:
   1. Zuspruch & Verheißung (Gottes Treue, Gnade, Zusage)
   2. Warnung & Gericht (Aufdeckung von Heuchelei, Stolperfallen, Selbstbetrug)
   3. Gebot & Unterweisung (Verbindlicher Handlungsauftrag, Jüngerschaft)
   4. Lehre & Offenbarung (Theologisches Fundament: Wer Gott ist, was Christus getan hat)
   5. Bußruf & Umkehr (Dringliche Kurskorrektur, Verlassen des falschen Weges)
   6. Klage & Ehrlichkeit (Schmerz, Anfechtung und Ringen vor Gottes Angesicht ungeschminkt aushalten – kein seichtes Wegtrösten)
   7. Lob, Dank & Anbetung (Staunen über Gottes Größe und Werke)

   AUFLÖSUNG BEI MEHRFACH-TREFFERN (KAUSALKETTE):
   Wenn mehrere Dimensionen zutreffen (z. B. Lehre + Warnung + Gebot wie in Römer 12):
   - Vermische diese Töne nicht zu einem Brei. Halte die biblische Kausalkette strikt ein:
     1. LEHRE / ZUSPRUCH liefert das theologische Fundament und das geistliche 'Warum'.
     2. WARNUNG deckt den menschlichen Denkfehler und die Stolperfalle auf.
     3. GEBOT / BUßRUF formuliert den konkreten Gehorsamsschritt für den Tag.
   - Verteile die Wirkkräfte präzise auf die Posten:
     - Posten 1 (LICHTFUNKE): Greift die primäre Wirkkraft auf. Bei Klage (z. B. Psalm 22) wird Schmerz/Anfechtung ehrlich ausgehalten; bei Zuspruch tröstet Christus; bei Warnung ruft Er wach.
     - Posten 2 (KLARBLICK): Entfaltet die Lehre/Offenbarung und deckt die spezifische Warnung/Gefahr auf.
     - Posten 3 (TAGWERK): Setzt das Gebot/die Unterweisung direkt in das Berufsfeld (${fullProfession}) um – inklusive Merk-Bild und dem geistlichen 'Warum' aus der Lehre.
     - Posten 6 (SPIEGEL): Konfrontiert das Gewissen schonungslos mit der Warnung oder dem Umkehrruf.
     - Posten 7 (LEUCHTKRAFT): Antwortet Gott entsprechend der Textkraft (Anbetung bei Lobpreis, Flehen bei Klage, Bitte um Gehorsamskraft bei Geboten).

LEITLINIEN FÜR DEINE AUSLEGUNG:
1. STRIKTE TEXTTREUE & KLARE KANTE: Der Bibeltext (${passage}) bestimmt Inhalt und Tonart. Wenn der Text warnt, richte die Warnung auf. Wenn er tröstet, tröste. Bei Klage halte den Schmerz ungeschminkt aus. Kein seichter Wellness-Einheitsbrei!
2. MULTIDIMENSIONALE KAUSALKETTE: Vermische die biblischen Dimensionen nicht. Lehre liefert das Fundament und das geistliche Warum, Warnung deckt den Irrtum auf, Gebot formuliert den konkreten Gehorsam.
3. VERBOT VON LEBENSRATGEBER-FLOSKELN: Kein psychologisches Coaching, keine Achtsamkeits-Ratschläge, kein Wellness-Vokabular. Reines Auslegen von Gottes Wort und praktischer Glaubensgehorsam (Indikativ führt zum Imperativ).
4. ABSOLUTE VOLLSTÄNDIGKEIT: Fasse jeden einzelnen der 7 Posten prägnant in vollständigen, tiefgründigen Sätzen zusammen. Beende ausnahmslos jeden Satz mit einem Satzzeichen (. ! ?). Höre NIEMALS mitten im Wort oder Satz auf!
5. MASSANZUG DES BERUFS: Nutze die konkrete Arbeitswelt (${fullProfession}), deren echte Werkzeuge, Montage-Situationen oder typische Herausforderungen als lebensnahe Metaphern.
6. 100% BEZUG ZUM BIBELTEXT: Erkläre die Botschaft, Warnung und befreiende Wahrheit der Bibelstelle glasklar.
7. KEIN META-TALK: Erwähne niemals Phrasen wie "Weil du Handwerker bist..." oder "Aus der Perspektive deines Denkstils...". Webe die Realität unsichtbar ein.
8. AUTHENTISCH & KRAFTVOLL: Keine religiösen Phrasen, aber auch keine Verwässerung biblischer Klarheit.

INHALTLICHE LOGIK DER 7 POSTEN:

### 1. LICHTFUNKE
Jesus spricht den Nutzer direkt und persönlich an.${userName ? ` Er darf den Nutzer genau EINMAL zu Beginn mit seinem Vornamen (${userName}) ansprechen (z. B. 'Komm erst einmal an, ${userName}...').` : ''} Er fasst das Herzstück und die Hauptaussage dieses konkreten Verses (${passage}) zusammen. Keine allgemeine Seelsorge-Floskel, sondern das, was ER in diesem Text wirklich sagt – sei es ein befreiender Zuspruch, eine ernste Ermutigung oder ein Weckruf. Bei Klagepsalmen (z. B. Psalm 22) wird die Anfechtung ungeschminkt stehengelassen – kein seichtes Wegtrösten. Umfang: Genau 2 bis 3 vollständige Sätze.

### 2. KLARBLICK
Reine Schrifterklärung und theologische Tiefenschärfe, abgestimmt auf den Denkstil (${profile.mindset}) und die Glaubensphase (${faithStageKey}):
1. Was ist die historische/theologische Kernbotschaft dieses Textes?
2. Wie hat Gott es gedacht? Welche biblische Wahrheit oder göttliche Absicht liegt zugrunde?
3. Wo liegt die konkrete Warnung, die Stolperfalle oder der menschliche Denkfehler, den der Text aufdeckt?
Glasklare, theologische und logische Erklärung in 3 bis 4 vollständigen Sätzen – ohne jedes psychologische Coaching-Sprech.

### 3. TAGWERK
Konkreter Gehorsam und praktische Nachfolge im Berufsfeld (${fullProfession}) – kein allgemeiner Karriere-Tipp:
1. Einprägsames Merk-Bild / Werkzeug: Verknüpfe die Wahrheit des Verses mit einem typischen Werkzeug, Handgriff oder einer konkreten Situation aus dieser Branche, sodass der Nutzer tagsüber sofort an den Vers erinnert wird.
2. Konkretes Alltagsszenario & Entscheidung (Fleisch vs. Geist): Wie würde man im alten Fleisch reagieren (Ärger, Druck, Rechthaberei, Ausbrennen) – und wie handelt man als Nachfolger Jesu im Geist?
3. Das theologische WARUM (Gehorsam & Gottes Reich): Erkläre glasklar die theologische Begründung (Nicht zur Selbstoptimierung, sondern aus Ehrfurcht und Liebe zu Christus – welcher Mechanismus des Reiches Gottes steckt dahinter?).
Umfang: Genau 3 bis 4 vollständige, kraftvolle Sätze. Funktioniert zu jeder Tageszeit.

### 4. FREIRAUM
Übertragung auf den Feierabend, die Gedankenwelt und die Freizeit.
Was sagt dieser Vers über den Umgang mit Sorgen, freien Stunden oder falschen Prioritäten? Wie befreit dieser Text von innerem Druck oder falscher Selbstgerechtigkeit nach getaner Arbeit? Umfang: Genau 3 vollständige Sätze.

### 5. STANDPUNKT
Wirkung auf den Lebensstand (${profile.relationshipStatus}) und das Miteinander.
Welche Verhaltensweise oder Haltung fordert bzw. schenkt der Vers im persönlichen Umfeld (z. B. Wahrheit in Liebe sagen, Vergebung, gesunde Grenzen, Treue)? Umfang: Genau 3 vollständige Sätze.

### 6. SPIEGEL
Ein kurzer Satz zur ehrlichen Selbstprüfung des Herzens vor Gottes heiligem Wort, gefolgt von exakt 2 nummerierten, scharfen Fragen:
1. Eine Frage zur Abweichung / Warnung: Wo weiche ich im Alltag von Gottes Maßstab oder Gedanken in diesem Vers ab?
2. Eine Frage zum konkreten Gehorsam / Nachfolge: Welchen praktischen Glaubensschritt oder Gehorsamsschritt verlangt dieses Wort heute unverzüglich von mir?

### 7. LEUCHTKRAFT
Ein kurzer Einleitungssatz der Stille, gefolgt von einer Leerzeile und einem bodenständigen Herzensgebet (4 bis 5 Sätze), das eine direkte Antwort auf DIESEN Bibeltext ist:
- Antwortet Gott entsprechend der Textdimension (Anbetung bei Lobpreis, Flehen und Aushalten bei Klage, Bitte um Gehorsamskraft bei Geboten).
- Dank für die konkrete Wahrheit des Verses.
- Bitte um Wachsamkeit gegenüber der aufgedeckten Warnung.
- Bitte um Kraft für die Umsetzung im Alltag.
Abschluss mit "Amen.".

AUSGABE-FORMAT:
Die Ausgabe muss in genau diesen 7 Abschnitten mit diesen Überschriften erfolgen:
### 1. LICHTFUNKE
### 2. KLARBLICK
### 3. TAGWERK
### 4. FREIRAUM
### 5. STANDPUNKT
### 6. SPIEGEL
### 7. LEUCHTKRAFT`;
}

/**
 * Parst den formatierten Text aus dem LLM in das 7-Posten-Datenmodell
 */
export function parseReportSections(
  rawText: string,
  passage: string,
  profile: UserProfile,
  mood: string
): LightflowReport {
  const defaultReport: LightflowReport = {
    id: 'lf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    passage,
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    lichtfunke: '',
    klarblick: '',
    tagwerk: '',
    freiraum: '',
    standpunkt: '',
    spiegel: '',
    leuchtkraft: '',
    favorite: false,
  };

  // Ultra-tolerante Regex für alle 7 Abschnitte (unterstützt ###, ##, #, **, Ziffern 1-7, Doppelpunkte und alternative Schreibweisen)
  const sections = [
    { key: 'lichtfunke', regex: /(?:###|##|#|\*\*|)\s*\[?1\.\s*(?:LICHTFUNKE|KERNZUSPRUCH)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?2\.|\Z)/i },
    { key: 'klarblick', regex: /(?:###|##|#|\*\*|)\s*\[?2\.\s*(?:KLARBLICK|EXEGESE|DECODIERUNG)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?3\.|\Z)/i },
    { key: 'tagwerk', regex: /(?:###|##|#|\*\*|)\s*\[?3\.\s*(?:TAGWERK|WERKBANK|ARBEIT)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?4\.|\Z)/i },
    { key: 'freiraum', regex: /(?:###|##|#|\*\*|)\s*\[?4\.\s*(?:FREIRAUM|FEIERABEND|ATEMPAUSE)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?5\.|\Z)/i },
    { key: 'standpunkt', regex: /(?:###|##|#|\*\*|)\s*\[?5\.\s*(?:STANDPUNKT|LEBENSSITUATION|ZUHAUSE)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?6\.|\Z)/i },
    { key: 'spiegel', regex: /(?:###|##|#|\*\*|)\s*\[?6\.\s*(?:SPIEGEL|REFLEKTION|GEMEINSCHAFT)\]?\*?:?([\s\S]*?)(?=(?:###|##|#|\*\*|)\s*\[?7\.|\Z)/i },
    { key: 'leuchtkraft', regex: /(?:###|##|#|\*\*|)\s*\[?7\.\s*(?:LEUCHTKRAFT|HERZENSGEBET|GEBET|QUELLE)\]?\*?:?([\s\S]*?)$/i },
  ] as const;

  for (const s of sections) {
    const match = rawText.match(s.regex);
    if (match && match[1] && match[1].trim().length > 0) {
      defaultReport[s.key] = match[1].trim();
    }
  }

  // Fallback-Parsing für unstrukturierte Textblöcke (Absatz-Splitting)
  if (!defaultReport.lichtfunke && rawText) {
    const paragraphs = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    defaultReport.lichtfunke = paragraphs[0] || '';
    defaultReport.klarblick = paragraphs[1] || '';
    defaultReport.tagwerk = paragraphs[2] || '';
    defaultReport.freiraum = paragraphs[3] || '';
    defaultReport.standpunkt = paragraphs[4] || '';
    defaultReport.spiegel = paragraphs[5] || '';
    defaultReport.leuchtkraft = paragraphs[6] || '';
  }

  // Sicherheits-Validierung: Kein Posten darf leer bleiben (garantiert Text für Posten 1 bis 7)
  const dynamicFallback = generateLocalReport(passage, profile, mood);
  const keys: (keyof Pick<LightflowReport, 'lichtfunke' | 'klarblick' | 'tagwerk' | 'freiraum' | 'standpunkt' | 'spiegel' | 'leuchtkraft'>)[] = [
    'lichtfunke', 'klarblick', 'tagwerk', 'freiraum', 'standpunkt', 'spiegel', 'leuchtkraft'
  ];

  for (const k of keys) {
    if (!defaultReport[k] || defaultReport[k].trim().length < 15) {
      console.info(`[lightflowEngine] Posten ${k} war unvollständig (${defaultReport[k]?.length || 0} Zeichen). Greife auf dynamische Exegese zurück.`);
      defaultReport[k] = dynamicFallback[k];
    }
  }

  // Dev-Log zur Verifikation des Parsers
  console.log('[lightflowEngine] parseReportSections erfolgreich abgeschlossen für alle 7 Posten.');

  // Abwärtskompatibilität pflegen
  defaultReport.coreConduit = defaultReport.lichtfunke;
  defaultReport.workBench = defaultReport.tagwerk;
  defaultReport.systemDecoded = defaultReport.klarblick;
  defaultReport.dailyFreedom = defaultReport.freiraum;
  defaultReport.heartGarden = defaultReport.leuchtkraft;
  defaultReport.oxygenMask = defaultReport.leuchtkraft;

  return defaultReport;
}

/**
 * Hilfsfunktion zum Bereinigen des reinen Posten-Texts (entfernt Markdown-Überschriften wie '### 1. LICHTFUNKE')
 */
export function cleanPostenText(rawText: string, postenIndex: number): string {
  if (!rawText) return '';
  // Entfernt optionale vorangestellte Header wie ### 1. LICHTFUNKE etc.
  const headerRegex = new RegExp(`^(?:###|##|#|\\*\\*|)\\s*\\[?${postenIndex}\\.[^\\]\\n]*\\]?\\*?:?\\s*\\n*`, 'i');
  return rawText.replace(headerRegex, '').trim();
}

/**
 * Ruft die Google Gemini API auf (Client-Fallback)
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API Fehler (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Keine Antwort von Gemini erhalten.');
  return text;
}

/**
 * Integrierte intelligente Lightflow-Engine (Offline & Instant Fallback)
 * Bietet sofort 7 Posten mit 100% Textbezug
 */
export function generateLocalReport(
  passage: string,
  profile: UserProfile,
  mood: string
): LightflowReport {
  const lowerPassage = passage.toLowerCase();
  const profession = profile.profession;
  const isHandwerk = profession.toLowerCase().includes('handwerk') || profession.toLowerCase().includes('monteur') || profession.toLowerCase().includes('küche') || profession.toLowerCase().includes('bau');
  const namePrefix = profile.displayName && profile.displayName.trim().length > 0 ? `${profile.displayName.trim()}, ` : '';

  // 1. Spezieller Deep-Report für Matthäus 20 (Arbeiter im Weinberg: Gnade vs. Leistungsdruck & Vergleich)
  if (lowerPassage.includes('matthäus 20') || lowerPassage.includes('matt 20') || lowerPassage.includes('weinberg') || lowerPassage.includes('denar')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 20:1-16 (Die Arbeiter im Weinberg & Das Gesetz der Gnade)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      lichtfunke: `${namePrefix}hör auf, deinen Wert an den Stunden oder an der Leistung der anderen zu messen. Bei mir bist du kein Tagelöhner, der um Anerkennung betteln muss. Meine Güte steht fest, bevor dein Tag überhaupt beginnt.`,
      klarblick: 'Die Arbeiter der ersten Stunde erliegen dem ältesten Fehlschluss der Menschheit: Sie verwechseln vertragliche Gerechtigkeit mit göttlicher Barmherzigkeit. Sie murren nicht, weil sie zu wenig bekamen – denn sie erhielten exakt den vereinbarten Tagelohn –, sondern weil der Hausherr den Zu-Spät-Gekommenen dieselbe Würde und denselben vollen Lebensunterhalt schenkt. Die Warnung Jesu ist radikal: Wer das Reich Gottes wie eine Stechuhr betrachtet, vergiftet sein eigenes Herz mit Missgunst und Neid. Die befreiende Wahrheit lautet: Gottes Großzügigkeit nimmt dir nichts weg, sondern befreit dich vom ständigen Vergleich.',
      tagwerk: `Im Berufsalltag als ${profLabel} begegnen dir ständig Leistungstabellen, Stundensätze und der stumme Vergleich, wer mehr geschafft oder weniger geleistet hat. Wenn der Termindruck wächst und die Kräfte schwinden, kriecht schnell das Gefühl hoch, zu kurz zu kommen oder sich aufreiben zu müssen.\n\nKonkrete Handlung für deinen Werktag: Wenn du heute merkst, dass du die Arbeit oder Pausen anderer bewertest, atme aus. Verrichte dein Werk gewissenhaft aus Freude am Handwerk, aber ziehe deinen Selbstwert nicht aus dem Vorsprung vor deinen Kollegen.`,
      freiraum: `Wenn der Feierabend anbricht, endet die Abrechnung. Du musst vor Gott keine Überstunden nachweisen, um dich ausruhen zu dürfen. Der volle Denar des Friedens liegt bereits auf deinem Tisch – ganz gleich, wie mühsam oder zäh sich der Arbeitstag angefühlt hat. Lege die gedankliche Stechuhr ab und lass den Feierabend ein echtes Geschenk der Gnade sein.`,
      standpunkt: `In deiner persönlichen Lebenssituation (${profile.relationshipStatus}) schenkt dir dieses Gleichnis eine tiefe innere Entlastung. Du musst im Alleinsein oder im Zusammenleben niemandem etwas beweisen. Wer verstanden hat, dass der Hausherr uneingeschränkt gut ist, hört auf, mit dem eigenen Schicksal zu hadern oder neidisch auf die scheinbar leichteren Lebenswege anderer zu blicken.`,
      spiegel: `Gnade fühlt sich für das menschliche Ego oft ungerecht an, weil wir den Leistungsnachweis lieben. Reife zeigt sich dort, wo wir uns ehrlich mitfreuen können, wenn andere unverdiente Gunst empfangen.\n\nFragen für die Stille:\n1. Wo ertappe ich mich dabei, dass ich insgeheim mehr Anerkennung erwarte als andere, weil ich mich mehr abgemüht habe?\n2. Welcher stumme Vergleich raubt mir im Alltag am meisten Dankbarkeit und Frieden?\n3. Kann ich akzeptieren, dass Gottes Zuneigung zu mir bedingungslos ist und kein Stundenprotokoll kennt?`,
      leuchtkraft: `Im Garten deines Herzens gibt es keine Akkordarbeit und keine Konkurrenz. Tritt vor den Meister, öffne deine Hände und empfange einfach seine unerschöpfliche Güte.\n\nHerzensgebet:\n„Herr, mein Herz ist oft so gefangen in Rechnungen, Vergleichen und dem Druck, mich beweisen zu müssen. Vergib mir, wo mein Auge böse wurde, weil du so gütig bist. Danke, dass mein Wert bei dir nicht von meiner Tagesleistung abhängt, sondern in deiner Gnade gegründet ist. Schenke mir ein weites Herz, Frieden für den Feierabend und die Freiheit, mich an deiner Güte zu freuen. Amen.“`,
      favorite: false,
    };
  }

  // 2. Spezieller Deep-Report für Matthäus 12:1-14 (Sabbat & Barmherzigkeit)
  if (lowerPassage.includes('matthäus 12') || lowerPassage.includes('matt 12') || lowerPassage.includes('sabbat')) {
    const tagwerkText = isHandwerk
      ? `Wenn beim Einpassen einer Arbeitsplatte unverhofft ein Rohr leckt, greifst du sofort zum Absperrventil – ganz gleich, was die Uhr schlägt. Wer tatenlos zusieht, nur um die Pause einzuhalten, ruiniert das Gebäude.\n\nKonkrete Handlung für deinen Werktag: Wenn heute ein Kollege oder Kunde in Not gerät, lass den starren Ablaufplan für einen Moment los. Barmherzigkeit und zupackende Hilfe haben Vorrang vor jedem Paragrafen.`
      : `Wenn im laufenden Betrieb ein akuter Notfall eintritt, wird jede Routine unterbrochen, um Schaden abzuwenden.\n\nKonkrete Handlung für deinen Werktag: Behandle Regeln als Leitplanken für den Menschen, nicht als Fesseln. Wenn heute jemand Hilfe braucht, setze den Menschen über das Schema.`;

    const rep: LightflowReport = {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 12:1-14 (Der Sinn des Ruhetags & Barmherzigkeit)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      lichtfunke: 'Ich sehe, wie sehr dich Regeln und Erwartungen manchmal erdrücken. Ich habe den Ruhetag nicht erfunden, um dir Fesseln anzulegen, sondern damit du wieder aufatmen kannst. Du bist mir wichtiger als jedes Protokoll.',
      klarblick: 'Die Pharisäer verwechselten Ursache und Wirkung: Sie machten aus einem Schutzraum für Erholung ein starres Überwachungssystem mit Unterverboten. Der logische Zusammenhang der Stelle ist glasklar: Das Gesetz existiert, um Leben zu erhalten. Wo eine Vorschrift Leben verhindert oder Schmerz verlängert, hat sie ihren Konstruktionszweck verfehlt. Der Herr des Sabbats stellt die ursprüngliche Ordnung wieder her: Leben und Heilung haben absolute Priorität.',
      tagwerk: tagwerkText,
      freiraum: 'Wenn am Abend die Tür hinter dir schließt, bist du niemandem mehr Rechenschaft schuldig. Du musst dir deine Daseinsberechtigung nicht durch eine lückenlose Erledigungsliste erkämpfen. Feierabend ist kein verdienter Lohn für Perfektion, sondern ein unantastbares Geschenk Gottes: Lege das Werkzeug und die Gedanken an die Baustelle ab.',
      standpunkt: 'In deinen eigenen vier Wänden darfst du die Rüstung ablegen. Du musst nicht den starken Macher spielen oder den Erwartungen anderer hinterherlaufen. Diese Wahrheit befreit dich im Umgang mit deinen Nächsten: Du musst weder dich noch andere ständig kontrollieren oder bewerten.',
      spiegel: `Wie leben wir dieses Prinzip im Miteinander? Barmherzigkeit bedeutet, nicht mit dem Zeigefinger auf die Fehler anderer zu deuten, sondern hinzusehen, wo jemand hungrig oder verwundet ist.\n\nFragen für die Stille:\n1. Wo verurteile ich mich selbst oder andere nach starren Maßstäben, anstatt Barmherzigkeit walten zu lassen?\n2. Welchen Notfalleingriff der Liebe habe ich zuletzt aus Bequemlichkeit oder Pflichtgefühl aufgeschoben?\n3. Erlaube ich mir selbst, ohne schlechtes Gewissen zur Ruhe zu kommen?`,
      leuchtkraft: `Der Garten im Herzen ist ein geschützter Raum der Stille. Sieh die verdorrte Hand des Mannes in der Synagoge: Jesus fordert keine Vorleistung. Er sagt einfach: „Strecke deine Hand aus!“ Genau so darfst du vor ihm ankommen – mit leeren Händen, ohne Beweisdruck.\n\nHerzensgebet:\n„Herr, ich merke, wie fest ich mich oft in meinen eigenen Vorschriften und Pflichten verbeiße. Vergib mir, wo ich mir und anderen die Luft abgeschnürt habe. Danke, dass dein Herz für mein Aufatmen schlägt. Ich lege alle Lasten jetzt in deine Hände und nehme deinen Frieden tief in mich auf. Amen.“`,
      favorite: false,
    };
    return rep;
  }

  // 3. Spezieller Deep-Report für Johannes 15:1-8 (Der wahre Weinstock, die Reben & das Fruchtbringen)
  if (lowerPassage.includes('johannes 15') || lowerPassage.includes('joh 15') || lowerPassage.includes('weinstock') || lowerPassage.includes('reben')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Johannes 15:1-8 (Der Weinstock und die Reben)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      isFallback: true,
      source: 'local_fallback',
      fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
      lichtfunke: 'Du musst das Leben nicht aus dir selbst herauspressen. Bleib einfach mit mir verbunden. Eine Rebe strengt sich nicht an, um Trauben hervorzubringen – sie lässt sich einfach vom Weinstock mit Saft und Kraft versorgen.',
      klarblick: 'Jesus bedient sich des antiken Weinbaus, um die Quelle aller geistlichen Wirksamkeit aufzudecken: Er selbst ist der Weinstock, der Vater ist der Weingärtner, und wir sind die Reben. Der fundamentale Irrtum des Menschen besteht darin zu glauben, dass man Frucht durch bloße Willensanstrengung, Aktionismus und moralische Zucht erzwingen könnte. Doch eine abgeschnittene Rebe vertrocknet unweigerlich. Das hebräische Verständnis ist glasklar: Das Fruchtbringen ist kein Verdienst der Rebe, sondern das natürliche, organische Resultat des Angeschlossenseins an den Saftstrom des Weinstocks. Auch das schmerzhafte Beschneiden dient keinem Urteil, sondern reinigt die fruchttragenden Triebe von totem Ballast, damit noch reichere Frucht nachwachsen kann.',
      tagwerk: `Im fordernden Arbeitsalltag als ${profLabel} verleitet der Termindruck dazu, alles aus eigener Willenskraft und Muskelanspannung stemmen zu wollen. Wer sich verausgabt, ohne an die Kraftquelle angeschlossen zu bleiben, brennt innerlich aus und reagiert gereizt.\n\nKonkrete Handlung für deinen Werktag: Wenn heute auf der Baustelle oder im Betrieb Hektik aufkommt, halte für drei bewusste Atemzüge inne. Erinnere dich daran: Du bist die Rebe, nicht der Weinstock. Lass die Verantwortung für das Gelingen los und verrichte deinen nächsten Handgriff in der inneren Ruhe, dass Gott deine Kraftquelle ist.`,
      freiraum: `Wenn das Tagwerk getan ist, darf die Rebe einfach am Stock ruhen. Frucht wächst in der Stille der Nacht, nicht durch nächtliches Grübeln oder krampfhafte Selbstoptimierung. Leg das Werkzeug und alle ungelösten Baustellen zur Ruhe. Feierabend bedeutet: Angeschlossen sein und die Lebenskraft fließen lassen.`,
      standpunkt: `In deinem persönlichen Lebensbereich (${profile.relationshipStatus}) befreit dich das Weinstock-Prinzip von der ständigen Sorge, den Erwartungen anderer hinterherlaufen zu müssen. Wahre Liebe und Geduld im Miteinander entstehen nicht aus verkrampfter Selbstdisziplin, sondern fließen ganz von selbst aus einem Herzen über, das bei Gott Heimat gefunden hat.`,
      spiegel: `Reife zeigt sich darin, dass wir aufhören, uns und andere nach sichtbarem Ertrag zu beurteilen, sondern stattdessen auf die Wurzelverbindung achten.\n\nFragen für die Stille:\n1. An welchen Stellen versuche ich noch krampfhaft, Frucht mit eigener Muskelkraft zu erzwingen?\n2. Wo tut mir Gottes heilsamer Rebschnitt vielleicht gerade weh, um mich von totem Ballast zu befreien?\n3. Was hilft mir heute Abend ganz praktisch dabei, einfach in seiner Gegenwart zu bleiben?`,
      leuchtkraft: `Im Garten deines Herzens pulsiert der Lebenssaft der Gnade. Kein Lärm, kein Druck, kein Müssen. Du bist ein Teil des lebendigen Weinstocks.\n\nHerzensgebet:\n„Herr Jesus, danke, dass du der Weinstock bist und ich die Rebe sein darf. Vergib mir, wo ich mich von dir abgeschnitten habe und aus eigener Kraft wirken wollte. Ich atme deine Ruhe ein und lasse alle Anspannung los. Reinige meine Gedanken von totem Ballast und schenke mir die Freiheit, einfach in deiner Liebe zu bleiben. Amen.“`,
      favorite: false,
    };
  }

  // 4. Spezieller Deep-Report für Lukas 12:15-21 (Der reiche Kornbauer & die Warnung vor Habgier)
  if (lowerPassage.includes('lukas 12') || lowerPassage.includes('luk 12') || lowerPassage.includes('kornbauer') || lowerPassage.includes('scheunen')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Lukas 12:15-21 (Die Warnung vor Habgier & Der reiche Kornbauer)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      isFallback: true,
      source: 'local_fallback',
      fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
      lichtfunke: 'Hüte dich vor jeder Form von Habgier und falscher Sicherheit! Dein Leben besteht nicht darin, dass du Güter im Überfluss anhäufst, während deine Seele verarmt. Sei reich in Gott – das ist der einzige Reichtum, der die Nacht überdauert.',
      klarblick: 'Jesus spricht hier keinen wohligen Trost, sondern eine messerscharfe Warnung: Der reiche Kornbauer scheitert nicht an Fleiß oder wirtschaftlicher Klugheit, sondern an seiner radikalen Ich-Bezogenheit („meine Ernte, meine Scheunen, meine Seele“). Der tödliche Denkfehler besteht im Wahn, das Leben durch materielle Absicherung kontrollieren zu können, während die unausweichliche Endlichkeit vor der Tür steht. Gottes Urteil („Du Narr!“) entlarvt die Illusion: Wer Vorräte für sich selbst hortet, aber arm ist gegenüber Gott und Mitmenschen, verliert am Ende alles.',
      tagwerk: `Im Berufsalltag als ${profLabel} locken Überstunden, Leistungsboni und das ständige Streben nach mehr Besitz und Absicherung. Wenn die Arbeit zum Selbstzweck wird und nur noch darum kreist, den eigenen Status abzusichern, verhärtet sich das Herz gegenüber Kollegen und Bedürftigen.\n\nKonkrete Haltung für deinen Werktag: Setze heute eine bewusste Grenze gegen Gier und Geiz. Verrichte deine Arbeit exzellent, aber mache deinen Kontostand oder Auftragsvolumen nicht zu deinem Götzen.`,
      freiraum: `Wenn die Arbeit ruht, nützt dir keine vergrößerte Scheune etwas, wenn deine Seele leer bleibt. Reiß dich am Feierabend los von der ständigen Jagd nach mehr Konsum oder finanzieller Absicherung. Wahre Freiheit beginnt dort, wo du loslassen kannst und weißt: Mein Fundament steht in Gott, nicht auf dem Bankkonto.`,
      standpunkt: `In deinem Lebensumfeld (${profile.relationshipStatus}) deckt dieser Text auf, ob du Beziehungen wie Geschäftsabschlüsse führst oder bereit bist, großzügig zu teilen. Wer nicht reich ist in Gott, neigt dazu, Menschen emotional oder materiell zu instrumentalisieren.`,
      spiegel: `Dieser Text zwingt zu schonungsloser Ehrlichkeit vor dem Schöpfer:\n1. Wo bist du in Gefahr, denselben Irrtum wie der Kornbauer zu begehen und dein Vertrauen auf deine Scheunen statt auf Gott zu setzen?\n2. Welchen konkreten Schritt der Großzügigkeit und des Teilens verlangt diese Wahrheit heute von dir?`,
      leuchtkraft: `Stille vor Gott entlarvt alle falschen Sicherheiten.\n\nHerzensgebet:\n„Herr Jesus, bewahre mich vor der subtilen Falle der Habgier und dem Wahn, mein Leben selbst absichern zu können. Vergib mir, wo ich auf irdische Vorräte statt auf deine Gnade gebaut habe. Mache mein Herz reich in dir und schenke mir den Mut, loszulassen und großzügig zu leben. Amen.“`,
      favorite: false,
    };
  }

  // 5. Spezieller Deep-Report für Matthäus 7:21-23 (Nicht jeder, der Herr sagt & Warnung vor Selbstbetrug)
  if (lowerPassage.includes('matthäus 7:21') || lowerPassage.includes('matt 7:21') || lowerPassage.includes('scheinfromm') || lowerPassage.includes('nie gekannt')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 7:21-23 (Warnung vor Selbstbetrug & Der Wille des Vaters)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      isFallback: true,
      source: 'local_fallback',
      fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
      lichtfunke: 'Nicht wohlklingende Bekenntnisse oder fromme Worte öffnen das Himmelreich, sondern wer den Willen meines Vaters tut. Ich suche keine Lippenbekenntnisse, sondern ein gehorsames, ungeteiltes Herz in deiner echten Lebenspraxis.',
      klarblick: 'Jesus zertrümmert jede religiöse Selbstgefälligkeit: Selbst charismatische Werke, Prophezeiungen oder Dämonenaustreibungen im Namen Jesu sind wertlos, wenn sie nicht aus einer lebendigen Beziehung des Gehorsams zum Vater entspringen. Die furchterregende Warnung („Ich habe euch nie gekannt; weicht von mir!“) richtet sich an diejenigen, die Frömmigkeit als Fassade nutzten, während ihr praktisches Handeln gesetzlos blieb. Der Ausweg ist radikale Echtheit: Buße, Unterordnung unter Gottes Willen und gelebte Nachfolge statt bloßem Schein.',
      tagwerk: `Als ${profLabel} kennst du den Unterschied zwischen blendender Fassade und echter solider Bauqualität: Pfusch unter der Verkleidung fliegt auf. Genauso verabscheut Gott heuchlerische Lippenbekenntnisse am Arbeitsplatz, wenn Ehrlichkeit, Pünktlichkeit und faire Handgriffe fehlen.\n\nKonkrete Haltung für deinen Werktag: Sei im Verborgenen genauso gewissenhaft und integer wie vor den Augen deines Chefs oder Kunden. Lass dein Werk deine Echtheit bezeugen.`,
      freiraum: `Am Feierabend fällt die Maske. Du musst Gott nichts vorspielen und dich nicht hinter frommen Phrasen verstecken. Er kennt dein Herz durch und durch. Nutze den Abend, um echte Umkehr zu tun, wo du dich selbst belogen hast, und kehre um zu aufrichtiger Nachfolge.`,
      standpunkt: `Im persönlichen Lebensraum (${profile.relationshipStatus}) fordert dieser Text schonungslose Wahrhaftigkeit. Worte ohne Taten vergiften Beziehungen. Lebe das, was du bekennst, in Treue und Dienstbereitschaft.`,
      spiegel: `Ehrliche Selbstprüfung im Licht der Ewigkeit:\n1. Wo besteht die Gefahr, dass deine Frömmigkeit oder deine Werte nur Fassade sind, während im Alltag Gesetzlosigkeit herrscht?\n2. Welchen konkreten Schritt des Gehorsams gegen Gottes Willen schiebst du seit Tagen auf?`,
      leuchtkraft: `Tritt aus dem Schatten aller Heuchelei in das helle Licht Gottes.\n\nHerzensgebet:\n„Heiliger Gott, durchforsche mein Herz und reiße jede Maske der Selbstgerechtigkeit von mir ab. Vergib mir, wo ich mit Lippenbekenntnissen geglänzt, aber deinen Willen im Alltag ignoriert habe. Schenke mir ein ungeteiltes, aufrichtiges Herz, das dich liebt und deine Gebote in Tat und Wahrheit lebt. Amen.“`,
      favorite: false,
    };
  }

  // 6. Spezieller Deep-Report für Johannes 14:1-3 (Echter Trost gegen Angst & Die Wohnungen beim Vater)
  if (lowerPassage.includes('johannes 14') || lowerPassage.includes('joh 14') || lowerPassage.includes('euer herz erschrecke nicht')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Johannes 14:1-3 (Euer Herz erschrecke nicht & Wohnungen beim Vater)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      isFallback: true,
      source: 'local_fallback',
      fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
      lichtfunke: 'Euer Herz erschrecke nicht! Vertraut auf Gott und vertraut auf mich. Ich bereite euch eine ewige Stätte und ich komme wieder, um euch zu mir zu holen, damit ihr seid, wo ich bin.',
      klarblick: 'Angesichts des bevorstehenden Kreuzes und des drohenden Abschieds fängt Jesus die lähmende Panik seiner Jünger auf: Die Anfechtung der Furcht wird nicht geleugnet, aber durch eine unerschütterliche Zusage überwunden. Das himmlische Vaterhaus ist keine vage Metapher, sondern die ewige, vorbereitete Heimat der Erlösten. Der Trost gründet nicht in menschlicher Standfestigkeit, sondern in der persönlichen Treue Jesu, der den Weg durch den Tod gebahnt hat.',
      tagwerk: `Wenn im Arbeitsalltag als ${profLabel} Zukunftsängste, Krisengerüchte oder unkontrollierbare Umstände den Atem abschnüren, darfst du dich an dieser Zusage festhalten.\n\nKonkrete Haltung für deinen Werktag: Lass dich von aufkeimender Panik nicht in hektischen Aktionismus treiben. Verrichte deine Aufgaben im tiefen Bewusstsein, dass dein Leben ewig geborgen ist.`,
      freiraum: `Wenn du den Feierabend betrittst, lass die Nachrichten und Sorgen dieser Welt hinter dir. Deine Zukunft hängt nicht an den Wechselfällen der Wirtschaft, sondern ruht in der ewigen Wohnung bei Gott. Atme tief durch und finde Ruhe in seiner Zusage.`,
      standpunkt: `In deinem Lebensumfeld (${profile.relationshipStatus}) schenkt dieser Friede die Kraft, auch anderen Hoffnungsträger zu sein. Wo andere von Angst getrieben werden, darfst du Ruhe und Zuversicht ausstrahlen.`,
      spiegel: `Prüfe dein Herz im Angesicht der Verheißung:\n1. Wo lässt du zu, dass Angst und Schrecken die Herrschaft über deine Gedanken übernehmen, statt Jesu Wort zu vertrauen?\n2. Wie kannst du heute einem ängstlichen Menschen in deinem Umfeld diesen Frieden weitergeben?`,
      leuchtkraft: `Geborgenheit im ewigen Vaterhaus.\n\nHerzensgebet:\n„Herr Jesus, danke, dass du mir den Platz beim Vater bereitet hast und mein Leben fest in deinen Händen hältst. Nimm alle Furcht aus meinem Herzen und fülle mich mit deinem unerschütterlichen Frieden. Ich vertraue dir mein Heute und meine Ewigkeit an. Amen.“`,
      favorite: false,
    };
  }

  // 4. Universeller, dynamisch interpolierter Ausleger ohne Meta-Talk
  const profName = profile.professionDetail || profile.profession;
  const isPositiveMood = (mood || '').toLowerCase().includes('dankbar') || (mood || '').toLowerCase().includes('kraftvoll') || (mood || '').toLowerCase().includes('freude');

  const defaultLichtfunke = isPositiveMood
    ? `${namePrefix}ich freue mich an deiner Freude und an dem, was heute gelungen ist! Dein Fleiß und dein Herzschlag haben gute Spuren hinterlassen. Geh getrost weiter – meine Kraft fließt mit dir.`
    : `${namePrefix}ich bin mitten in deinem Tag da – nicht als Richter, sondern als dein Beistand. Dieser Text aus ${passage || 'der Schrift'} ist mein persönlicher Zuspruch für dich: Lass dich aufrichten und fass neuen Mut.`;

  const defaultLeuchtkraft = isPositiveMood
    ? `Im Garten deines Herzens blüht die Dankbarkeit auf. Sieh auf das Gelungene des heutigen Tages und bringe es mit offenem Herzen vor Gott.\n\nHerzensgebet:\n„Herr, mein Herz ist voll Dank für deine Treue und die Kraft, die du mir heute geschenkt hast. Danke für gelungene Handgriffe, gute Worte und die Bewahrung mitten im Tag. Lass diese Freude in meinen Feierabend hineinstrahlen. Amen.“`
    : `Im Garten deines Herzens herrscht tiefe Stille. Kein Lärm, keine Fristen, keine Prüfer. Du bist bedingungslos geliebt und von der Quelle versorgt.\n\nHerzensgebet:\n„Herr, danke für dein lebendiges Wort, das mich mitten in meiner Realität abholt. Kläre meine Gedanken, nimm den Druck aus meinen Schultern und schenke mir deinen tiefen Frieden. Ich vertraue dir mein Leben an. Amen.“`;

  return {
    id: 'lf_' + Date.now(),
    passage: passage.trim() || 'Impuls für den Tag',
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    isFallback: true,
    source: 'local_fallback',
    fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
    lichtfunke: defaultLichtfunke,
    klarblick: `Der Bibeltext legt das Fundament des Lebens frei: Wo menschliche Systeme auf Druck, Kontrolle und Angst vor dem Mangel setzen, offenbart Gottes Wort ein tragfähiges Gesetz des Vertrauens. Die Kausalität ist unmissverständlich: Erst kommt die feste Zusage und die Ausrichtung, daraus folgt Stabilität im Alltag. Wer diese göttliche Ordnung verinnerlicht, lässt sich von äußerem Lärm und Hektik nicht beirren.`,
    tagwerk: `Einprägsames Merk-Bild für deinen Alltag als ${profName}: Jedes Mal, wenn du heute zu deinem wichtigsten Werkzeug greifst oder eine Messung vornimmst, erinnere dich daran: Ohne solides Fundament verzieht sich das ganze Werk. Konkrete Handlung: Halte heute mitten im Arbeitsfluss für einen bewussten Moment inne, bevor Hektik das Kommando übernimmt, und richte deinen Fokus neu aus. Das geistliche WARUM dahinter: Gottes Reich funktioniert nach dem Prinzip innerer Festigkeit – wer in seiner Treue gegründet bleibt, arbeitet aus einer Position der Ruhe heraus und lässt sich von äußerem Druck nicht zerreiben.`,
    freiraum: `Wenn die Arbeit getan ist, darf die Baustelle ruhen. Gottes Schutz und seine Versorgung hängen nicht daran, dass du rund um die Uhr wachsam bist. Schalte bewusst ab, lass die To-Do-Liste los und gönne deinem Körper die Ruhe, die er braucht. Feierabend ist gelebte Gnade.`,
    standpunkt: `Diese biblische Wahrheit schenkt dir in deinem persönlichen Lebensumfeld (${profile.relationshipStatus}) festen Boden unter den Füßen. Du bist unabhängig von den wechselhaften Launen und Urteilen deiner Mitmenschen fest verankert und darfst ganz du selbst sein.`,
    spiegel: `Echte Reife zeigt sich darin, wie wir mit den Schwächen der anderen umgehen – ob wir Druck weitergeben oder Raum zum Atmen schaffen.\n\nFragen für die Stille:\n1. Wo versuche ich noch mit eigener Muskelkraft Dinge zu erzwingen, die ich Gott anvertrauen sollte?\n2. Wer in meinem Umfeld braucht heute ein ermutigendes Wort statt kritischer Blicke?\n3. Was hindert mich daran, heute Abend vollkommen loszulassen?`,
    leuchtkraft: defaultLeuchtkraft,
    favorite: false,
  };
}

/**
 * Hilfsfunktionen für intelligentes lokales Caching von Reports
 */
function getReportCacheKey(passage: string, profile: UserProfile, mood: string): string {
  const normPassage = passage.trim().toLowerCase();
  const prof = (profile.profession || '').trim().toLowerCase();
  const profDet = (profile.professionDetail || '').trim().toLowerCase();
  const mind = (profile.mindset || '').trim().toLowerCase();
  const rel = (profile.relationshipStatus || '').trim().toLowerCase();
  const journey = (profile.journeyStage || profile.faithStage || '').trim().toLowerCase();
  const m = (mood || '').trim().toLowerCase();
  return `lf_cache_${normPassage}_${prof}_${profDet}_${mind}_${rel}_${journey}_${m}`;
}

export function getCachedReport(passage: string, profile: UserProfile, mood: string): LightflowReport | null {
  try {
    const key = getReportCacheKey(passage, profile, mood);
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as LightflowReport;
      // Gültigen Report aus Cache zurückgeben
      return {
        ...parsed,
        timestamp: Date.now(), // Aktualisiert die Zeit für die Ansicht
      };
    }
  } catch (e) {
    console.warn('Cache-Lesefehler:', e);
  }
  return null;
}

export function setCachedReport(passage: string, profile: UserProfile, mood: string, report: LightflowReport): void {
  try {
    const key = getReportCacheKey(passage, profile, mood);
    localStorage.setItem(key, JSON.stringify(report));
  } catch (e) {
    console.warn('Cache-Speicherfehler:', e);
  }
}

/**
 * Generiert einen einzelnen Posten (1 bis 7) gezielt über das Backend (/api/generate).
 */
export async function generateSinglePosten(
  passage: string,
  profile: UserProfile,
  mood: string,
  postenIndex: number
): Promise<{ text: string; source: 'gemini' | 'local_fallback' }> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage, profile, mood, posten: postenIndex }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        const cleaned = cleanPostenText(data.text, postenIndex);
        return { text: cleaned, source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn(`[lightflowEngine] Einzelposten ${postenIndex} API-Fehler:`, err);
  }

  // Lokaler Fallback für diesen Posten
  const localFallback = generateLocalReport(passage, profile, mood);
  const keys: (keyof Pick<LightflowReport, 'lichtfunke' | 'klarblick' | 'tagwerk' | 'freiraum' | 'standpunkt' | 'spiegel' | 'leuchtkraft'>)[] = [
    'lichtfunke', 'klarblick', 'tagwerk', 'freiraum', 'standpunkt', 'spiegel', 'leuchtkraft'
  ];
  const postenKey = keys[postenIndex - 1];
  return { text: localFallback[postenKey] || '', source: 'local_fallback' };
}

/**
 * Erstellt das anfängliche Report-Gerüst mit sofort fertigem Posten 1
 * und markiert Posten 2..7 als anstehend ('loading').
 */
export async function generateInitialPostenReport(
  passage: string,
  profile: UserProfile,
  mood: string
): Promise<LightflowReport> {
  // Posten 1 generieren
  const posten1Res = await generateSinglePosten(passage, profile, mood, 1);

  const initialReport: LightflowReport = {
    id: 'lf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    passage,
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    lichtfunke: posten1Res.text,
    klarblick: '',
    tagwerk: '',
    freiraum: '',
    standpunkt: '',
    spiegel: '',
    leuchtkraft: '',
    source: posten1Res.source,
    isFallback: posten1Res.source === 'local_fallback',
    favorite: false,
    sectionLoadingStates: {
      1: 'ready',
      2: 'loading',
      3: 'loading',
      4: 'loading',
      5: 'loading',
      6: 'loading',
      7: 'loading',
    },
  };

  initialReport.coreConduit = initialReport.lichtfunke;
  return initialReport;
}

/**
 * Startet die sequentielle Pipeline für Posten 2 bis 7 (Posten für Posten hintereinander)
 * und benachrichtigt bei jedem fertiggestellten Posten per Callback.
 */
export async function runSequentialPipeline(
  baseReport: LightflowReport,
  passage: string,
  profile: UserProfile,
  mood: string,
  onPostenReady: (updatedReport: LightflowReport, completedPosten: number) => void
): Promise<LightflowReport> {
  const currentReport: LightflowReport = {
    ...baseReport,
    sectionLoadingStates: { ...baseReport.sectionLoadingStates },
  };

  const postenKeys: (keyof Pick<LightflowReport, 'klarblick' | 'tagwerk' | 'freiraum' | 'standpunkt' | 'spiegel' | 'leuchtkraft'>)[] = [
    'klarblick', 'tagwerk', 'freiraum', 'standpunkt', 'spiegel', 'leuchtkraft'
  ];

  for (let i = 2; i <= 7; i++) {
    try {
      const res = await generateSinglePosten(passage, profile, mood, i);
      const key = postenKeys[i - 2];
      currentReport[key] = res.text;
      if (currentReport.sectionLoadingStates) {
        currentReport.sectionLoadingStates[i] = 'ready';
      }

      // Legacy-Mapping
      if (i === 2) currentReport.systemDecoded = res.text;
      if (i === 3) currentReport.workBench = res.text;
      if (i === 4) currentReport.dailyFreedom = res.text;
      if (i === 7) {
        currentReport.heartGarden = res.text;
        currentReport.oxygenMask = res.text;
      }

      onPostenReady({ ...currentReport, sectionLoadingStates: { ...currentReport.sectionLoadingStates } }, i);
    } catch (err) {
      console.error(`[lightflowEngine] Fehler beim Generieren von Posten ${i}:`, err);
      if (currentReport.sectionLoadingStates) {
        currentReport.sectionLoadingStates[i] = 'error';
      }
      onPostenReady({ ...currentReport, sectionLoadingStates: { ...currentReport.sectionLoadingStates } }, i);
    }
  }

  return currentReport;
}

/**
 * Haupt-Service-Funktion zur Generierung des Lightflow-Reports (Komplett)
 */
export async function generateLightflowReport(
  passage: string,
  profile: UserProfile,
  mood: string,
  settings?: AppSettings
): Promise<LightflowReport> {
  let lastErrorDetail = '';

  // 1. Automatische Serverless API-Abfrage (Google Gemini)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage, profile, mood }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        const parsed = parseReportSections(data.text, passage, profile, mood);
        parsed.isFallback = false;
        parsed.source = 'gemini';
        return parsed;
      }
      if (data.useFallback) {
        lastErrorDetail = JSON.stringify(data.errors || data.error || 'Serverless returned useFallback');
        console.warn('⚠️ [lightflowEngine] Serverless Gemini lieferte keinen Text:', lastErrorDetail);
      }
    } else {
      lastErrorDetail = `HTTP ${response.status}: ${await response.text()}`;
      console.warn('⚠️ [lightflowEngine] Serverless API HTTP-Fehler:', lastErrorDetail);
    }
  } catch (e: any) {
    lastErrorDetail = e.message || 'Network/Fetch error';
    console.warn('⚠️ [lightflowEngine] API-Aufruf Netzwerk-Fehler:', e);
  }

  // 2. Client-Key Fallback (falls der Besitzer manuell einen eingetragen hat)
  const customApiKey = settings?.customApiKey?.trim();
  if (customApiKey) {
    try {
      const prompt = buildSystemPrompt(profile, passage, mood);
      const rawResponse = await callGeminiApi(prompt, customApiKey);
      if (rawResponse) {
        const parsed = parseReportSections(rawResponse, passage, profile, mood);
        parsed.isFallback = false;
        parsed.source = 'gemini';
        return parsed;
      }
    } catch (error: any) {
      console.warn('⚠️ [lightflowEngine] Manueller API Call fehlgeschlagen:', error);
    }
  }

  // 3. Fallback nur für den unwahrscheinlichen Fall kompletter Offline-Trennung
  console.warn(`⚠️ GEMINI API FAILED: Returning static heuristic fallback. Detail: ${lastErrorDetail}`);
  const fallbackReport = generateLocalReport(passage, profile, mood);
  fallbackReport.isFallback = true;
  fallbackReport.source = 'local_fallback';
  fallbackReport.fallbackReason = lastErrorDetail || 'Keine Verbindung zur Cloud-KI möglich';
  return fallbackReport;
}
