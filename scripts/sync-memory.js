#!/usr/bin/env node

/**
 * Memory-Sync-Agent Runner für Lightflow
 * Scannt docs/decisions/, indiziert alle Architecture Decision Records (ADRs)
 * und synchronisiert das Langzeitgedächtnis für zukünftige Agenten-Sessions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const decisionsDir = path.join(rootDir, 'docs', 'decisions');

console.log('🧠 [Memory-Sync-Agent] Starte Synchronisation des Architektur-Journals...');

if (!fs.existsSync(decisionsDir)) {
  fs.mkdirSync(decisionsDir, { recursive: true });
}

const files = fs.readdirSync(decisionsDir).filter((f) => f.startsWith('ADR-') && f.endsWith('.md')).sort();

const adrs = [];

for (const file of files) {
  const filePath = path.join(decisionsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const dateMatch = content.match(/\*\s*Datum:\s*([^\n\r*]+)/i);
  const statusMatch = content.match(/\*\s*Status:\s*\*?([^\n\r*]+)\*?/i);
  const decisionMakersMatch = content.match(/\*\s*Entscheidungsträger:\s*([^\n\r*]+)/i);

  const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');
  const date = dateMatch ? dateMatch[1].trim() : 'Unbekannt';
  const status = statusMatch ? statusMatch[1].trim() : 'Akzeptiert';
  const makers = decisionMakersMatch ? decisionMakersMatch[1].trim() : 'Team';

  adrs.push({
    file,
    id: file.replace('.md', ''),
    title,
    date,
    status,
    makers,
  });
}

console.log(`📋 Gefundene ADRs: ${adrs.length}`);
adrs.forEach((adr) => {
  console.log(`   - [${adr.id}] ${adr.title} (${adr.status})`);
});

// Generiere aktualisierten README-Index
const readmeContent = `# Architecture Decision Records (ADRs) – Lightflow

Willkommen im bidirektionalen Architektur-Gedächtnis von Lightflow. Dieses Verzeichnis hält alle weichenstellenden Design-, Technologie- und Logik-Entscheidungen nach dem **Michael Nygard Standard** fest.

Jeder Agent (Livia, Der Macher, Rene, Thomas, Nico) liest dieses Verzeichnis zu Beginn einer Session, um 100% Kontext über bestehende Muster und vermiedene Fallstricke zu haben.

---

## Index aller Architektur-Entscheidungen

| ADR | Titel | Status | Datum | Relevante Agenten / Beteiligte |
| :--- | :--- | :--- | :--- | :--- |
${adrs
  .map(
    (a) =>
      `| [${a.id}](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/${a.file}) | ${a.title} | ${a.status} | ${a.date} | ${a.makers} |`
  )
  .join('\n')}

---

## ADR-Template (Michael Nygard Standard)

\`\`\`markdown
# [Nummer]. [Titel]

* Datum: [YYYY-MM-DD]
* Status: [Vorgeschlagen | Akzeptiert | Veraltet | Ersetzt]
* Entscheidungsträger: [z. B. Thomas, Der Macher, Livia, Rene, Chef]

## Kontext & Problemstellung
[Welches technische oder gestalterische Problem lag vor?]

## Betrachtete Optionen
- Option 1: ...
- Option 2: ...

## Entscheidung
[Was wurde gewählt und warum?]

## Konsequenzen
- Positiv: ...
- Negativ / Risiken: ...
\`\`\`
`;

fs.writeFileSync(path.join(decisionsDir, 'README.md'), readmeContent, 'utf-8');
console.log('✅ [Memory-Sync-Agent] docs/decisions/README.md erfolgreich synchronisiert!');
