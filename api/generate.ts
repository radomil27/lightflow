// Vercel Serverless Function für Lightflow
// Vollautomatische serverseitige KI-Generierung über Google Gemini
export default async function handler(req: any, res: any) {
  // CORS Header für PWA
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passage, profile, mood } = req.body || {};

  if (!passage || !profile) {
    return res.status(400).json({ error: 'Passage und Profil erforderlich' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Gibt Fallback-Signal an Client, falls noch kein Key in Vercel hinterlegt ist
    return res.status(200).json({ useFallback: true });
  }

  try {
    const prompt = `Du bist die theologische und lebenspraktische KI-Engine von "Lightflow – Angeschlossen an die Quelle".
Deine Aufgabe ist es, einen biblischen Text so zu übersetzen, dass er VOLLSTÄNDIG und IN JEDEM EINZELNEN DER 6 BEREICHE auf das persönliche Profil des Nutzers abgestimmt ist.

NUTZER-PROFIL (DAS VERBINDUNGSPROFIL):
- 1. Beruf & Handwerkswelt: "${profile.profession}" (Verwende konkretes Fachvokabular, Werkzeuge, Abläufe, Reale Herausforderungen aus genau diesem Beruf!)
- 2. Denkweise & Kognitiver Stil: "${profile.mindset}" (z. B. lösungsorientiert & analytisch -> logische Kausalitäten; bildhaft -> plastische Vergleiche; systemisch -> Fehlerdiagnose & Architektur)
- 3. Lebenssituation & Beziehungsstatus: "${profile.relationshipStatus}" (z. B. Single/Alleinlebend -> Feierabend allein, Stille, Selbstfürsorge; Familie -> Trubel, Partner, Kinder, Verantwortung)
- 4. Glaubensphase: "${profile.faithStage || 'Auf der Suche'}" (z. B. hinterfragend/kritisch -> keine frommen Klischees, ehrlich und logisch; ausgelaugt -> sanft, kein neuer Leistungsdruck)
- 5. Heutige Tagesverfassung / Stimmung: "${mood || profile.dailyMood || 'Suche Klarheit'}"

BIBELTEXT / PASSAGE:
${passage}

STRIKTE LEITLINIEN FÜR ALLE 6 BEREICHE:
- Kein allgemeines "Kirchen-Deutsch", keine Phrasen wie "Glaube einfach fest".
- Jeder Bereich muss die Lebenswelt des Nutzers widerspiegeln!

STRUKTUR DER 6 BEREICHE:

### [1. DIE KERNLEITUNG]
(1-2 glasklare, kraftvolle Sätze als Hauptimpuls. Formuliert so, dass es direkt den Kern der aktuellen Tagesverfassung "${mood || profile.dailyMood}" und die Denkweise "${profile.mindset}" trifft.)

### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
(Vollständig auf den Beruf "${profile.profession}" zugeschnitten! Ziehe eine tiefgreifende, praktische Analogie mit echten Fachbegriffen und typischen Situationen aus diesem Beruf. Warum verhält sich der geistliche Grundsatz aus der Bibelstelle exakt wie ein physikalisches oder fachliches Gesetz in diesem Gewerk?)

### [3. DAS SYSTEM ENTSCHLÜSSELT]
(Auf die Denkweise "${profile.mindset}" abgestimmt. Analytische Fehlerdiagnose: Wo liegt der menschliche Systemfehler / Denkfehler (z. B. Kontrollzwang, Gesetzeskrampf, Leistungsdruck), und wie sieht das göttliche Funktionsprinzip aus? Ursache -> Auswirkung -> Befreiende Lösung.)

### [4. FREIRAUM IM ALLTAG]
(Direkt abgestimmt auf die Lebenssituation "${profile.relationshipStatus}" und den Feierabend nach der Arbeit als ${profile.profession}. Wie sieht praktische Freiheit heute Abend konkret aus? Welchen Druck darf der Nutzer jetzt vor der Haustür ablegen?)

### [5. DER GARTEN IM HERZEN]
(Ein geschützter Raum des Auftankens, zugeschnitten auf die Glaubensphase "${profile.faithStage || 'Ehrlich'}" und die heutige Stimmung "${mood || profile.dailyMood}". Keine To-Do-Liste für den Glauben, sondern pure Gnade, bedingungslose Annahme und Erholung an der Quelle.)

### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]
(Ein ehrliches, unfrommes Herzensgebet in der Ich-Form. Es greift den heutigen Tag, den Beruf (${profile.profession}) und die Verfassung (${mood || profile.dailyMood}) auf. Wie eine Sauerstoffmaske, die tiefes Aufatmen schenkt.)`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API Fehler:', err);
      return res.status(200).json({ useFallback: true, error: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text, source: 'gemini' });
  } catch (error: any) {
    console.error('Serverless Catch:', error);
    return res.status(200).json({ useFallback: true, error: error.message });
  }
}
