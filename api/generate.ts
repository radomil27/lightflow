import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel Serverless Function für Lightflow
// Ermöglicht automatische KI-Generierung für alle Nutzer ohne Client-Key-Eingabe
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Header
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passage, profile, mood } = req.body || {};

  if (!passage || !profile) {
    return res.status(400).json({ error: 'Passage und Profil erforderlich' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  // Wenn kein Server-Key hinterlegt ist, liefert die API ein Signal für den lokalen Fallback
  if (!apiKey) {
    return res.status(200).json({ useFallback: true });
  }

  try {
    const prompt = `Du bist der Kern von "Lightflow" – eine warme, weise und bodenständige Stimme, die Gottes Wort wie eine Sauerstoffleitung direkt in den Alltag des Menschen fließen lässt.

DEINE NUTZER-DATEN:
- Beruf / Fachmetaphern: ${profile.profession}
- Denkweise: ${profile.mindset}
- Lebenssituation: ${profile.relationshipStatus}
- Heutige Verfassung: ${mood || profile.dailyMood}

BIBELTEXT:
${passage}

LEITLINIEN FÜR DEINE SPRACHE:
1. Sei absolut bodenständig, warmherzig und frei von religiösem Fachchinesisch.
2. Nutze treffende Metaphern aus "${profile.profession}", damit die Zusammenhänge sofort logisch einleuchten.
3. Begegne dem Nutzer nicht von oben herab, sondern wie ein erfahrener Meister an der Werkbank.
4. Schaffe im Bereich "Garten im Herzen" einen Raum der tiefen Ruhe – Gnade statt Zwang.

AUSGABE-FORMAT:
### [1. DIE KERNLEITUNG]
### [2. DIE WERKBANK - DEINE ALLTAGSANALOGIE]
### [3. DAS SYSTEM ENTSCHLÜSSELT]
### [4. FREIRAUM IM ALLTAG]
### [5. DER GARTEN IM HERZEN]
### [6. DIE SAUERSTOFFMASKE - DEIN GEBET]`;

    if (process.env.GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini Error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.status(200).json({ text, source: 'gemini' });
    }

    return res.status(200).json({ useFallback: true });
  } catch (error: any) {
    console.error('Serverless Error:', error);
    return res.status(200).json({ useFallback: true, error: error.message });
  }
}
