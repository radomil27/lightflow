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

    const { posten } = req.body || {};
    const selectedPosten = typeof posten === 'number' && posten >= 1 && posten <= 7 ? posten : null;

    const sectionDescriptions: Record<number, { title: string; prompt: string }> = {
      1: {
        title: '### 1. LICHTFUNKE',
        prompt: 'Jesus spricht den Nutzer direkt, persönlich, warmherzig und auf Augenhöhe an. Keine Theologie, sondern ein erster Funke, der das Herz berührt und die Kernaussage der Bibelstelle in klaren, vollständigen und liebevollen Worten zusammenfasst.'
      },
      2: {
        title: '### 2. KLARBLICK',
        prompt: `Die Bibelstelle wird in ihrer vollen Erzählung und Tiefe glasklar aufgeschlüsselt, exakt abgestimmt auf den Denkstil des Nutzers (${profile.mindset}):\n- Was passiert in der Geschichte / in diesem Bibeltext konkret?\n- Wo liegt der menschliche Irrtum oder die Warnung des Textes?\n- Was ist die befreiende Kernaussage und die logische Wirkungsweise des Reiches Gottes?\nAlle Sätze müssen vollständig und zusammenhängend ausformuliert sein, sodass die Botschaft unmittelbar einleuchtet.`
      },
      3: {
        title: '### 3. TAGWERK',
        prompt: `Übertragung auf den Beruf und den Arbeitsalltag des Nutzers (${fullProfession}). Wie greift das Prinzip mitten bei der Arbeit, unter Zeitdruck oder im Umgang mit Kunden und Kollegen? Inklusive einer konkreten, praktischen Handlungsweise für den Werktag.`
      },
      4: {
        title: '### 4. FREIRAUM',
        prompt: 'Freizeit, Erholung und Feierabend. Was bedeutet diese Bibelstelle, wenn die Arbeit getan ist? Wie hilft sie dabei, mental komplett abzuschalten, inneren Druck abzubauen und ohne schlechtes Gewissen zur Ruhe zu kommen?'
      },
      5: {
        title: '### 5. STANDPUNKT',
        prompt: `Bezug zur persönlichen Lebenssituation und dem Zivilstand (${profile.relationshipStatus}). Wie wirkt sich diese Wahrheit auf das persönliche Leben, das Alleinsein oder das Zusammenleben und den Umgang mit Mitmenschen aus?`
      },
      6: {
        title: '### 6. SPIEGEL',
        prompt: 'Wie man dieses Prinzip im Miteinander, in Gemeinschaft oder Gemeinde lebt (z. B. Barmherzigkeit statt Verurteilung). Enthält 2 bis 3 direkte, tiefgehende Fragen in ganzen Sätzen, die der Nutzer im Stillen für sich selbst reflektieren kann.'
      },
      7: {
        title: '### 7. LEUCHTKRAFT',
        prompt: 'Der Garten im Herzen: Der geschützte Ort der Stille und Begegnung mit Gott, an dem man ohne Leistung ankommen und Gnade empfangen darf. Abgeschlossen mit einem ehrlichen, erdnahen Herzensgebet in vollständigen Sätzen, das alle vorherigen Punkte aufgreift.'
      }
    };

    let prompt = '';
    let maxTokens = 2500;

    if (selectedPosten) {
      maxTokens = 650;
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

BIBELTEXT:
${passage}

NUTZER-DATEN:
- Beruf / Tätigkeitsfeld: ${fullProfession}
- Denkstil: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Weg mit Jesus: ${journey}
- Heutige Tagesverfassung: ${currentMood}

LEITLINIEN:
- KEINE abgehackten Sätze. Vollständige, berührende, grammatikalisch geschlossene Sätze.
- 100% Bezug zum Bibeltext.
- Kein Meta-Talk (nicht sagen "Weil du...").

AUFGABE:
Generiere AUSSCHLIESSLICH den folgenden Baustein:
${sectionDescriptions[selectedPosten].title}
${sectionDescriptions[selectedPosten].prompt}

FORMAT:
${sectionDescriptions[selectedPosten].title}
[Dein Text hier in vollständigen Sätzen]`;
    } else {
      prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

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
${sectionDescriptions[1].prompt}

### 2. KLARBLICK
${sectionDescriptions[2].prompt}

### 3. TAGWERK
${sectionDescriptions[3].prompt}

### 4. FREIRAUM
${sectionDescriptions[4].prompt}

### 5. STANDPUNKT
${sectionDescriptions[5].prompt}

### 6. SPIEGEL
${sectionDescriptions[6].prompt}

### 7. LEUCHTKRAFT
${sectionDescriptions[7].prompt}

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

    // Priorität auf Gemini 3.8 und 3.7 gemäß Vorgabe
    // Kaskadierende Ausfallkette: 3.8 -> 3.7 -> Fallbacks (2.5, flash-latest, 1.5) zur 100% Fehlerfreiheit
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.8',
      'gemini-3.7-flash',
      'gemini-3.7',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-flash-latest',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-001',
      'gemini-1.5-pro-latest'
    ];

    let lastError = '';
    // Probiere der Reihe nach die besten Modelle durch
    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ text, source: 'gemini', model, posten: selectedPosten });
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
