// Vercel Serverless Function: Fragt Google Gemini nach allen verfügbaren Modellen
export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(200).json({ error: 'NO_KEY' });
  }

  try {
    const v1betaUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const r1 = await fetch(v1betaUrl);
    const d1 = await r1.json();

    const v1Url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const r2 = await fetch(v1Url);
    const d2 = await r2.json();

    return res.status(200).json({
      v1betaModels: d1.models?.map((m: any) => m.name) || d1,
      v1Models: d2.models?.map((m: any) => m.name) || d2
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
