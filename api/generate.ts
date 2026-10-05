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
    const fullProfession = profile.professionDetail && profile.professionDetail.trim().length > 0
      ? `${profile.profession} (Konkrete Tätigkeit & Alltag: ${profile.professionDetail.trim()})`
      : profile.profession;

    const prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

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

    // Priorität auf Gemini 3.8 und 3.7 gemäß Vorgabe
    // Schnelle dynamische Erkennung der verfügbaren Modelle, um Timeouts durch ungültige IDs zu verhindern
    let activeModels: string[] = [];
    try {
      const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (listResp.ok) {
        const listData = await listResp.json();
        activeModels = (listData.models || [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
      }
    } catch (_) {}

    // Sortierung nach Kunden-Vorgabe:
    // 1. Gemini 3.8
    // 2. Gemini 3.7
    // 3. Sichere Fallbacks (2.5, 2.0, 1.5) zur 100% Fehlerfreiheit
    const score = (m: string) => {
      if (m.includes('3.8')) return 100;
      if (m.includes('3.7')) return 90;
      if (m.includes('2.5')) return 80;
      if (m.includes('2.0-flash')) return 70;
      if (m.includes('2.0')) return 65;
      if (m.includes('1.5-flash')) return 60;
      if (m.includes('1.5-pro')) return 55;
      return 10;
    };

    activeModels.sort((a, b) => score(b) - score(a));

    const queue = (activeModels.length > 0 ? activeModels : [
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ]).slice(0, 3);

    let lastError = '';
    // Probiere der Reihe nach die besten Modelle durch (schneller 1.5s Check für 3.8/3.7, stabiler 7.5s Lauf für Arbeitsmodelle)
    for (const model of queue) {
      try {
        const isFutureModel = model.includes('3.8') || model.includes('3.7');
        const timeoutMs = isFutureModel ? 1500 : 7500;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2500 },
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

    return res.status(200).json({ useFallback: true, error: lastError });
  } catch (error: any) {
    console.error('Serverless Catch:', error);
    return res.status(200).json({ useFallback: true, error: error.message });
  }
}
