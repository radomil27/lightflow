# Architecture Decision Records (ADRs) – Lightflow

Willkommen im bidirektionalen Architektur-Gedächtnis von Lightflow. Dieses Verzeichnis hält alle weichenstellenden Design-, Technologie- und Logik-Entscheidungen nach dem **Michael Nygard Standard** fest.

Jeder Agent (Livia, Der Macher, Rene, Thomas, Nico) liest dieses Verzeichnis zu Beginn einer Session, um 100% Kontext über bestehende Muster und vermiedene Fallstricke zu haben.

---

## Index aller Architektur-Entscheidungen

| ADR | Titel | Status | Datum | Relevante Agenten / Beteiligte |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-0001-record-architecture-decisions](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/ADR-0001-record-architecture-decisions.md) | 1. Einführung von Architecture Decision Records (ADR) |  | 2026-10-13 | Chef, Thomas (Lead Developer), Das Antigravity-Team |
| [ADR-0002-progressive-disclosure-timer](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/ADR-0002-progressive-disclosure-timer.md) | 2. Re-Render-resistente Timer mit useRef & 4s-Notanker |  | 2026-10-13 | Der Macher, Livia, Rene |
| [ADR-0003-serverless-cascade-and-fallback](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/ADR-0003-serverless-cascade-and-fallback.md) | 3. Gemini 3.8/3.7 Cloud-Kaskade & Zero-Error Offline-Heuristik |  | 2026-10-13 | Rene (Security), Marco (Token-Controller), Der Macher |
| [ADR-0004-automated-visual-testing-and-memory-sync](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/ADR-0004-automated-visual-testing-and-memory-sync.md) | 4. Playwright Visual/State-Testing & Autonomer Memory-Sync |  | 2026-10-13 | Chef, Thomas (Lead), Rene (Security Gatekeeper) |
| [ADR-0005-security-audit-and-rls-hardening](file:///Users/mira/Documents/antigravity/bold-bohr/docs/decisions/ADR-0005-security-audit-and-rls-hardening.md) | 5. Sicherheits-Audit & Supabase RLS Härtung |  | 2026-10-15 | Chef, Rene (Security Gatekeeper), Thomas (Lead Developer) |

---

## ADR-Template (Michael Nygard Standard)

```markdown
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
```
