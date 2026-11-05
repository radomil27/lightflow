// Vercel Serverless Function für Lightflow
// Serverseitige Admin-Passwort-Verifikation (Schutz gegen Brute-Force & Client-Decompilation)

const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);
  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
}

export default async function handler(req: any, res: any) {
  // CORS-Absicherung
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://lichtflow.ch',
    'https://www.lichtflow.ch',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  if (allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // IP-basiertes Rate-Limiting: maximal 5 Versuche pro Minute
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(clientIp, 5, 60000)) {
    return res.status(429).json({ error: 'Zu viele Anmeldeversuche. Bitte 1 Minute warten.' });
  }

  const { password } = req.body || {};
  const serverPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN;

  if (!serverPassword) {
    console.warn('[api/verify-admin] Kein ADMIN_PASSWORD auf Server konfiguriert.');
    return res.status(500).json({ error: 'Server-Konfiguration unvollständig.' });
  }

  if (typeof password === 'string' && password.trim() === serverPassword.trim()) {
    return res.status(200).json({ success: true, message: 'Autorisiert' });
  }

  return res.status(401).json({ success: false, error: 'Ungültiges Admin-Passwort' });
}
