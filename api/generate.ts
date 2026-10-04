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
    const prompt = `Du bist die theologische und lebenspraktische Exegese-Engine von "Lightflow – Angeschlossen an die Quelle".

AUFGABE:
Lege den ausgewählten BIBELTEXT mit 100%iger Treue und Tiefenschärfe aus.
Übersetze seine tiefste theologische Bedeutung, seine Mechanismen und seine Botschaft vollkommen organisch in die Begriffswelt, Bildsprache und Denkstruktur des Nutzers – OHNE Jemals zu erklären oder zu erwähnen, welche Attribute im Profil stehen!

AUSGEWÄHLTER BIBELTEXT / PASSAGE:
${passage}

HINTERGRUND DES ZUHÖRERS (Nur als Schablone und Resonanzraum für Bildnisse und Sprache nutzen!):
- Lebenswelt & vertraute Metaphern: "${profile.profession}"
- Denkstil & Verstehensmuster: "${profile.mindset}"
- Alltägliche Lebenssituation: "${profile.relationshipStatus}"
- Glaubensphase: "${profile.faithStage || 'Auf der Suche'}"
- Heutige Verfassung: "${mood || profile.dailyMood || 'Suche Klarheit'}"

STRIKTE REGELN (SEHR WICHTIG):
1. KEIN META-TALK: Schreibe NIEMALS Sätze wie "Da du als X arbeitest...", "In deinem Beruf als...", "Weil du Single/Familie bist...", "Für dein Mindset...". Der Nutzer weiß selbst, was er arbeitet und wie er lebt! Sprich einfach direkt in seiner Sprache und mit Bildern, die sich anfühlen, als wären sie wie selbstverständlich für ihn gedacht.
2. 100% BEZUG AUF DEN BIBELTEXT: Jeder Gedanke, jede Analogie und jeder Schritt muss direkt aus den Versen und Geschehnissen des Bibeltextes hervorgehen. Erkläre den Text, seine Dynamik, was damals geschieht und was das universelle Prinzip dahinter ist.
3. MAẞGESCHNEIDERTE VERSTÄNDNIS-HILFE: Nutze packende, präzise Bildnisse und Parallelen, die den Text sofort begreifbar machen (z. B. handwerkliche Toleranzen, Hebelkräfte, Materialspannungen, Systemregeln, Stromkreise, je nach Welt des Nutzers).
4. KEINE FROMMEN FLOSKELN: Kein hohles Kirchen-Deutsch. Authentisch, kraftvoll, geerdet und tief berührend.

STRUKTUR DER 6 BEREICHE:

### [1. DIE KERNLEITUNG]
(1-2 glasklare, kraftvolle Sätze. Die Essenz des Bibeltextes auf den Punkt gebracht – messerscharf und unmittelbar treffend.)

### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
(Nimm das zentrale Geschehen / Gleichnis / Gebot des Bibeltextes und übersetze das Funktionsprinzip in ein treffendes Bild aus der Lebenswelt. Zeige ganz konkret, warum der biblische Grundsatz physikalisch/praktisch genauso funktioniert wie ein alltägliches Natur- oder Handwerksgesetz. Ohne Floskeln, reine praktische Bildhaftigkeit des Textes.)

### [3. DAS SYSTEM ENTSCHLÜSSELT]
(Analytische Text-Entschlüsselung: Was ist der theologische / menschliche Kernkonflikt im Bibeltext? Welcher Denkfehler oder falsche Mechanismus wird von Jesus / dem Text entlarvt? Welches göttliche Prinzip wird stattdessen offengelegt? Ursache, Hebelwirkung und Befreiung.)

### [4. FREIRAUM IM ALLTAG]
(Die praktische Konsequenz des Bibeltextes für den heutigen Feierabend und das persönliche Leben: Was bedeutet die Botschaft dieser Verse, wenn der Arbeitstag vorbei ist? Welche Last nimmt der Bibeltext von den Schultern?)

### [5. DER GARTEN IM HERZEN]
(Der spirituelle Ruhepol des Bibeltextes: Wo schenkt dieser konkrete Text bedingungslose Gnade, Schutz und Annahme? Ein Ort des Auftankens, abgeleitet direkt aus dem Trost und der Tiefe der Schriftstelle.)

### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]
(Ein ehrliches, unfrommes Gebet in der Ich-Form, das unmittelbar auf die Botschaft des Bibeltextes antwortet. Wie das erste tiefe Durchatmen nach einem langen Tauchgang.)`;

    // Aktuell verfügbare Gemini-Modelle laut API
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-pro-latest'
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
