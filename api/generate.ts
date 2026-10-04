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
    const journey = profile.journeyStage || profile.faithStage || 'Im Zweifel & Sucht Antworten';
    const currentMood = mood || profile.dailyMood || 'Suche Klarheit';

    const prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN:
- Beruf / Tätigkeitsfeld: ${profile.profession}
- Denkstil / Stärken: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

LEITLINIEN FÜR DEINE AUSLEGUNG:
1. KEIN META-TALK: Erkläre NIEMALS, was der Nutzer für eine Arbeit hat, welchen Beziehungsstatus oder welches Mindset er hat. Der Nutzer weiß das selbst. Nutze sein Profil als unsichtbaren Maßanzug, damit sich jeder Posten wie maßgeschneidert anfühlt.
2. 100% BEZUG ZUM AUSGEWÄHLTEN BIBELTEXT: Jeder Gedanke, jede Analogie und jede Frage muss direkt aus der Passage stammen.
3. AUTHENTISCH & TIEF: Keine hohlen religiösen Floskeln, kein Leistungsdruck.

INHALTLICHE LOGIK DER 7 POSTEN:

### 1. LICHTFUNKE
Jesus spricht den Nutzer direkt, persönlich, warmherzig und auf Augenhöhe an. Keine Theologie, sondern ein erster Funke, der das Herz berührt und die Kernaussage in klaren, einfachen Worten zusammenfasst.

### 2. KLARBLICK
Erklärung der Bibelstelle exakt angepasst an den Denkstil des Nutzers (${profile.mindset}). Die Funktionsweise und der logische Zusammenhang der Stelle werden klar aufgeschlüsselt.

### 3. TAGWERK
Übertragung auf den Beruf und den Arbeitsalltag des Nutzers (${profile.profession}). Wie greift das Prinzip mitten bei der Arbeit, unter Zeitdruck oder im Umgang mit Kunden und Kollegen? Inklusive einer konkreten Handlungsweise für den Werktag.

### 4. FREIRAUM
Freizeit, Erholung und Feierabend. Was bedeutet diese Bibelstelle, wenn die Arbeit getan ist? Wie hilft sie dabei, abzuschalten, inneren Druck abzubauen und ohne schlechtes Gewissen zur Ruhe zu kommen?

### 5. STANDPUNKT
Bezug zur persönlichen Lebenssituation und dem Zivilstand (${profile.relationshipStatus}). Wie wirkt sich diese Wahrheit auf das persönliche Leben und den Umgang mit Mitmenschen aus?

### 6. SPIEGEL
Wie man dieses Prinzip im Miteinander, in Gemeinschaft oder Gemeinde lebt (z. B. Barmherzigkeit statt Verurteilung). Enthält 2 bis 3 direkte, ehrliche Fragen, die der Nutzer im Stillen für sich selbst beantworten kann.

### 7. LEUCHTKRAFT
Der Garten im Herzen: Der geschützte Ort der Stille und Begegnung mit Gott, an dem man ohne Leistung ankommen und Gnade empfangen darf. Abgeschlossen mit einem ehrlichen, erdnahen Herzensgebet, das alle vorherigen Punkte aufgreift.

AUSGABE-FORMAT:
Die Ausgabe muss in genau diesen 7 Abschnitten mit diesen Überschriften erfolgen:
### 1. LICHTFUNKE
### 2. KLARBLICK
### 3. TAGWERK
### 4. FREIRAUM
### 5. STANDPUNKT
### 6. SPIEGEL
### 7. LEUCHTKRAFT`;

    // Modelle mit hoher / uneingeschränkter Free-Tier Quota (Flash-Lite & Gemma vor Pro)
    const candidateModels = [
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemma-4-31b-it'
    ];

    let lastError = '';
    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ text, source: 'gemini', model });
          }
        } else {
          lastError = await response.text();
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    // Falls kein Modell direkt klappte, frage die Liste der verfügbaren Modelle für diesen Key ab
    try {
      const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (listResp.ok) {
        const listData = await listResp.json();
        const available = listData.models?.map((m: any) => m.name) || [];
        return res.status(200).json({ useFallback: true, error: lastError, availableModels: available });
      }
    } catch (_) {}

    return res.status(200).json({ useFallback: true, error: lastError });
  } catch (error: any) {
    console.error('Serverless Catch:', error);
    return res.status(200).json({ useFallback: true, error: error.message });
  }
}
