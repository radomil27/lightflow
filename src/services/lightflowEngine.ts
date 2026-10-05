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
  const journey = profile.journeyStage || profile.faithStage || 'Im Zweifel & Sucht Antworten';
  const currentMood = mood || profile.dailyMood || 'Suche Klarheit';
  const fullProfession = profile.professionDetail && profile.professionDetail.trim().length > 0
    ? `${profile.profession} (Konkrete Tätigkeit & Alltag: ${profile.professionDetail.trim()})`
    : profile.profession;

  return `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN:
- Beruf / Tätigkeitsfeld & Praxiswelt: ${fullProfession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

LEITLINIEN FÜR DEINE AUSLEGUNG:
1. KEINE ABGEHACKTEN SÄTZE: Formuliere jeden einzelnen Gedanken in vollständigen, grammatikalisch geschlossenen, flüssigen und tiefgründigen Sätzen. Breche niemals mitten im Satz oder Gedanken ab.
2. 100% BEZUG & VERSTÄNDNIS DES BIBELTEXTES: Erkläre den Text so, dass die Erzählung, der geschichtliche Ablauf, die konkrete Warnung, die Fehlschlüsse der Menschen und die befreiende Kernerkenntnis absolut verständlich und glasklar werden. Der Leser muss sofort verstehen, was die eigentliche Botschaft ist.
3. PRAXISNAH & AUTHENTISCH: Nutze die konkrete Arbeitswelt des Nutzers (${fullProfession}), seine typischen Werkzeuge, Herausforderungen, Montage-Situationen oder Arbeitsabläufe als lebendige Metaphern, ohne ihm zu belehren, wer er ist.
4. KEIN META-TALK: Erkläre NIEMALS, was der Nutzer für eine Arbeit hat, welchen Beziehungsstatus oder welches Mindset er hat (z. B. nicht sagen "Weil du Handwerker bist..."). Nutze sein Profil als unsichtbaren Maßanzug.
5. AUTHENTISCH & TIEF: Keine oberflächlichen Floskeln, kein religiöser Leistungsdruck.

INHALTLICHE LOGIK DER 7 POSTEN:

### 1. LICHTFUNKE
Jesus spricht den Nutzer direkt und persönlich an. Er nimmt den zentralen Gedanken oder das Hauptbild des Bibeltextes (${passage}) auf und formuliert daraus einen unmittelbaren Zuspruch auf Augenhöhe. Keine allgemeine Seelsorge-Floskel, sondern der Kern dieser konkreten Bibelstelle als befreiende Zusage. Umfang: Genau 2 bis 3 vollständige Sätze.

### 2. KLARBLICK
Exegese abgestimmt auf den Denkstil (${profile.mindset}):
1. Was ist die menschliche Falle oder der Irrtum in dieser Geschichte/diesem Text?
2. Was ist das befreiende Prinzip des Reiches Gottes (Gnade, Vertrauen, Gottes Handeln statt menschlicher Krampf)?
Kein theologischer Fachjargon, sondern eine logisch einleuchtende Erklärung in 3 bis 4 vollständigen Sätzen.

### 3. TAGWERK
1:1-Übertragung in die konkrete Praxiswelt (${fullProfession}).
Nutze reale Fachbegriffe, typische Werkzeuge und Handgriffe. Zeige auf, wie das biblische Prinzip greift, wenn Zeitdruck herrscht, Dinge nicht passen oder Reibung entsteht. Keine Wellness-Tipps wie 'tief atmen', sondern eine handfeste Haltung für saubere Arbeit ohne Verbissenheit. Umfang: Genau 3 bis 4 vollständige Sätze.

### 4. FREIRAUM
Feierabend und Loslassen. Wenn das Werkzeug verstaut und die Arbeit beendet ist: Warum darf der Nutzer ohne schlechtes Gewissen Feierabend machen? Verankere das Prinzip, dass der menschliche Wert nicht an der unfertigen To-Do-Liste hängt. Umfang: 3 vollständige Sätze.

### 5. STANDPUNKT
Bezug auf das reale Lebensumfeld (${profile.relationshipStatus}). Gesunde Grenzen, Annahme und Entlastung im Miteinander oder Alleinsein. Umfang: 3 vollständige Sätze.

### 6. SPIEGEL
Ein kurzer Einleitungssatz über Barmherzigkeit und Echtheit im Miteinander, gefolgt von exakt 2 nummerierten, ehrlichen Reflexionsfragen für die persönliche Stille (z. B. "1. Wo versuchst du gerade..." und "2. Welchen Druck kannst du heute...").

### 7. LEUCHTKRAFT
Ein kurzer Satz des Ankommens in Gottes Gegenwart, gefolgt von einer Leerzeile und einem bodenständigen, unverkrampften Herzensgebet (4 bis 5 Sätze), das die Themen des Tages und der Bibelstelle aufgreift und mit "Amen." abschließt.

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

  // 1. Spezieller Deep-Report für Matthäus 20 (Arbeiter im Weinberg: Gnade vs. Leistungsdruck & Vergleich)
  if (lowerPassage.includes('matthäus 20') || lowerPassage.includes('matt 20') || lowerPassage.includes('weinberg') || lowerPassage.includes('denar')) {
    const profLabel = profile.professionDetail || profile.profession;
    return {
      id: 'lf_' + Date.now(),
      passage: passage.trim() || 'Matthäus 20:1-16 (Die Arbeiter im Weinberg & Das Gesetz der Gnade)',
      timestamp: Date.now(),
      profileSnapshot: { ...profile },
      mood,
      lichtfunke: 'Hör auf, deinen Wert an den Stunden oder an der Leistung der anderen zu messen. Bei mir bist du kein Tagelöhner, der um Anerkennung betteln muss. Meine Güte steht fest, bevor dein Tag überhaupt beginnt.',
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

  // 4. Universeller, dynamisch interpolierter Ausleger ohne Meta-Talk
  const profName = profile.professionDetail || profile.profession;
  return {
    id: 'lf_' + Date.now(),
    passage: passage.trim() || 'Impuls für den Tag',
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    isFallback: true,
    source: 'local_fallback',
    fallbackReason: 'Lokale Exegese-Engine (Offline-Schutz)',
    lichtfunke: `Ich bin mitten in deinem Tag da – nicht als Richter, sondern als dein Beistand. Dieser Text aus ${passage || 'der Schrift'} ist mein persönlicher Zuspruch für dich: Lass dich aufrichten und fass neuen Mut.`,
    klarblick: `Der Bibeltext legt das Fundament des Lebens frei: Wo menschliche Systeme auf Druck, Kontrolle und Angst vor dem Mangel setzen, offenbart Gottes Wort ein tragfähiges Gesetz des Vertrauens. Die Kausalität ist unmissverständlich: Erst kommt die feste Zusage und die Ausrichtung, daraus folgt Stabilität im Alltag. Wer diese göttliche Ordnung verinnerlicht, lässt sich von äußerem Lärm und Hektik nicht beirren.`,
    tagwerk: `In der konkreten Praxis als ${profName} entscheidet die richtige Ausrichtung: Ist das Fundament schief, verzieht sich das ganze Werk. Wenn der Zeitdruck zunimmt, bewahre einen klaren Kopf.\n\nKonkrete Handlung für deinen Werktag: Halte heute mitten in der Hektik für 30 Sekunden inne, atme durch und richte deine Aufmerksamkeit neu aus, bevor du die nächste Aufgabe anpackst.`,
    freiraum: `Wenn die Arbeit getan ist, darf die Baustelle ruhen. Gottes Schutz und seine Versorgung hängen nicht daran, dass du rund um die Uhr wachsam bist. Schalte bewusst ab, lass die To-Do-Liste los und gönne deinem Körper die Ruhe, die er braucht. Feierabend ist gelebte Gnade.`,
    standpunkt: `Diese biblische Wahrheit schenkt dir in deinem persönlichen Lebensumfeld (${profile.relationshipStatus}) festen Boden unter den Füßen. Du bist unabhängig von den wechselhaften Launen und Urteilen deiner Mitmenschen fest verankert und darfst ganz du selbst sein.`,
    spiegel: `Echte Reife zeigt sich darin, wie wir mit den Schwächen der anderen umgehen – ob wir Druck weitergeben oder Raum zum Atmen schaffen.\n\nFragen für die Stille:\n1. Wo versuche ich noch mit eigener Muskelkraft Dinge zu erzwingen, die ich Gott anvertrauen sollte?\n2. Wer in meinem Umfeld braucht heute ein ermutigendes Wort statt kritischer Blicke?\n3. Was hindert mich daran, heute Abend vollkommen loszulassen?`,
    leuchtkraft: `Im Garten deines Herzens herrscht tiefe Stille. Kein Lärm, keine Fristen, keine Prüfer. Du bist bedingungslos geliebt und von der Quelle versorgt.\n\nHerzensgebet:\n„Herr, danke für dein lebendiges Wort, das mich mitten in meiner Realität abholt. Kläre meine Gedanken, nimm den Druck aus meinen Schultern und schenke mir deinen tiefen Frieden. Ich vertraue dir mein Leben an. Amen.“`,
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
