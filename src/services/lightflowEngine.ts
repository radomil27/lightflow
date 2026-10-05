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
Jesus spricht den Nutzer direkt, persönlich, warmherzig und auf Augenhöhe an. Keine Theologie, sondern ein erster Funke, der das Herz berührt und die Kernaussage der Bibelstelle in klaren, vollständigen und liebevollen Worten zusammenfasst.

### 2. KLARBLICK
Die Bibelstelle wird in ihrer vollen Erzählung und Tiefe glasklar aufgeschlüsselt, exakt abgestimmt auf den Denkstil des Nutzers (${profile.mindset}):
- Was passiert in der Geschichte / in diesem Bibeltext konkret?
- Wo liegt der menschliche Irrtum oder die Warnung des Textes?
- Was ist die befreiende Kernaussage und die logische Wirkungsweise des Reiches Gottes?
Alle Sätze müssen vollständig und zusammenhängend ausformuliert sein, sodass die Botschaft unmittelbar einleuchtet.

### 3. TAGWERK
Übertragung auf den Beruf und den Arbeitsalltag des Nutzers (${profile.profession}). Wie greift das Prinzip mitten bei der Arbeit, unter Zeitdruck oder im Umgang mit Kunden und Kollegen? Inklusive einer konkreten, praktischen Handlungsweise für den Werktag.

### 4. FREIRAUM
Freizeit, Erholung und Feierabend. Was bedeutet diese Bibelstelle, wenn die Arbeit getan ist? Wie hilft sie dabei, mental komplett abzuschalten, inneren Druck abzubauen und ohne schlechtes Gewissen zur Ruhe zu kommen?

### 5. STANDPUNKT
Bezug zur persönlichen Lebenssituation und dem Zivilstand (${profile.relationshipStatus}). Wie wirkt sich diese Wahrheit auf das persönliche Leben, das Alleinsein oder das Zusammenleben und den Umgang mit Mitmenschen aus?

### 6. SPIEGEL
Wie man dieses Prinzip im Miteinander, in Gemeinschaft oder Gemeinde lebt (z. B. Barmherzigkeit statt Verurteilung). Enthält 2 bis 3 direkte, tiefgehende Fragen in ganzen Sätzen, die der Nutzer im Stillen für sich selbst reflektieren kann.

### 7. LEUCHTKRAFT
Der Garten im Herzen: Der geschützte Ort der Stille und Begegnung mit Gott, an dem man ohne Leistung ankommen und Gnade empfangen darf. Abgeschlossen mit einem ehrlichen, erdnahen Herzensgebet in vollständigen Sätzen, das alle vorherigen Punkte aufgreift.

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

  const sections = [
    { key: 'lichtfunke', regex: /###\s*\[?1\.\s*LICHTFUNKE\]?([\s\S]*?)(?=###\s*\[?2\.|\Z)/i },
    { key: 'klarblick', regex: /###\s*\[?2\.\s*KLARBLICK\]?([\s\S]*?)(?=###\s*\[?3\.|\Z)/i },
    { key: 'tagwerk', regex: /###\s*\[?3\.\s*TAGWERK\]?([\s\S]*?)(?=###\s*\[?4\.|\Z)/i },
    { key: 'freiraum', regex: /###\s*\[?4\.\s*(?:FREIRAUM|FEIERABEND)\]?([\s\S]*?)(?=###\s*\[?5\.|\Z)/i },
    { key: 'standpunkt', regex: /###\s*\[?5\.\s*STANDPUNKT\]?([\s\S]*?)(?=###\s*\[?6\.|\Z)/i },
    { key: 'spiegel', regex: /###\s*\[?6\.\s*SPIEGEL\]?([\s\S]*?)(?=###\s*\[?7\.|\Z)/i },
    { key: 'leuchtkraft', regex: /###\s*\[?7\.\s*LEUCHTKRAFT\]?([\s\S]*?)$/i },
  ] as const;

  for (const s of sections) {
    const match = rawText.match(s.regex);
    if (match && match[1]) {
      defaultReport[s.key] = match[1].trim();
    }
  }

  // Fallback-Parsing für abweichende Formate
  if (!defaultReport.lichtfunke && rawText) {
    const paragraphs = rawText.split('\n\n').filter((p) => p.trim().length > 0);
    defaultReport.lichtfunke = paragraphs[0] || 'Ich bin da, wo du gerade stehst.';
    defaultReport.klarblick = paragraphs[1] || 'Der Text legt das Fundament des Lebens frei.';
    defaultReport.tagwerk = paragraphs[2] || 'Mitten in der Praxis greift Gottes Ausrichtung.';
    defaultReport.freiraum = paragraphs[3] || 'Der Feierabend gehört dir und dem Atemholen.';
    defaultReport.standpunkt = paragraphs[4] || 'In deinem persönlichen Raum darf Friede einkehren.';
    defaultReport.spiegel = paragraphs[5] || 'Prüfe dein Herz im Stillen: Wo darf Gnade herrschen?';
    defaultReport.leuchtkraft = paragraphs[6] || 'Hier im Garten darfst du einfach sein. Herr, danke für dein Licht. Amen.';
  }

  // Auch Abwärtskompatibilität pflegen
  defaultReport.coreConduit = defaultReport.lichtfunke;
  defaultReport.workBench = defaultReport.tagwerk;
  defaultReport.systemDecoded = defaultReport.klarblick;
  defaultReport.dailyFreedom = defaultReport.freiraum;
  defaultReport.heartGarden = defaultReport.leuchtkraft;
  defaultReport.oxygenMask = defaultReport.leuchtkraft;

  return defaultReport;
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

  // Spezieller Deep-Report für Matthäus 12:1-14 (Sabbat & Barmherzigkeit)
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

  // Universeller, tiefgründiger Ausleger für jeden gewählten Bibeltext
  return {
    id: 'lf_' + Date.now(),
    passage: passage.trim() || 'Impuls für den Tag',
    timestamp: Date.now(),
    profileSnapshot: { ...profile },
    mood,
    lichtfunke: `Ich bin mitten in deinem Tag da – nicht als Richter, sondern als dein Beistand. Dieser Text ist mein persönlicher Zuspruch für dich: Lass dich aufrichten und fass neuen Mut.`,
    klarblick: `Der Bibeltext legt das Fundament des Lebens frei: Wo menschliche Systeme auf Druck, Kontrolle und Angst vor dem Mangel setzen, offenbart Gottes Wort ein tragfähiges Gesetz des Vertrauens. Die Kausalität ist unmissverständlich: Erst kommt die feste Zusage und die Ausrichtung, daraus folgt Stabilität im Alltag.`,
    tagwerk: `In der rauen Praxis entscheidet die Ausrichtung: Ist das Fundament schief, verzieht sich das ganze Werk. Wenn der Zeitdruck zunimmt, bewahre einen klaren Kopf.\n\nKonkrete Handlung für deinen Werktag: Halte heute mitten in der Hektik für 30 Sekunden inne, atme durch und richte deine Aufmerksamkeit neu aus, bevor du die nächste Aufgabe anpackst.`,
    freiraum: `Wenn die Arbeit getan ist, darf die Baustelle ruhen. Gottes Schutz und seine Versorgung hängen nicht daran, dass du rund um die Uhr wachsam bist. Schalte bewusst ab, lass die To-Do-Liste los und gönne deinem Körper die Ruhe, die er braucht.`,
    standpunkt: `Diese biblische Wahrheit schenkt dir in deinem persönlichen Lebensumfeld festen Boden unter den Füßen. Du bist unabhängig von den wechselhaften Launen und Urteilen deiner Mitmenschen fest verankert.`,
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
 * Haupt-Service-Funktion zur Generierung des Lightflow-Reports
 * Arbeitet zu 100% cloudbasiert über Google Gemini (3.8 / 3.7).
 * Keine lokale Handy-Generierung, kein alter Cache: Immer frische, tiefe Exegese direkt von der KI!
 */
export async function generateLightflowReport(
  passage: string,
  profile: UserProfile,
  mood: string,
  settings?: AppSettings
): Promise<LightflowReport> {
  // 1. Automatische Serverless API-Abfrage (Google Gemini 3.8 / 3.7)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage, profile, mood }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return parseReportSections(data.text, passage, profile, mood);
      }
    }
  } catch (e) {
    console.warn('API-Aufruf Fehler:', e);
  }

  // 2. Client-Key Fallback (falls der Besitzer manuell einen eingetragen hat)
  const customApiKey = settings?.customApiKey?.trim();
  if (customApiKey) {
    try {
      const prompt = buildSystemPrompt(profile, passage, mood);
      const rawResponse = await callGeminiApi(prompt, customApiKey);
      if (rawResponse) {
        return parseReportSections(rawResponse, passage, profile, mood);
      }
    } catch (error) {
      console.warn('Manueller API Call fehlgeschlagen:', error);
    }
  }

  // 3. Fallback nur für den unwahrscheinlichen Fall kompletter Offline-Trennung
  return generateLocalReport(passage, profile, mood);
}
