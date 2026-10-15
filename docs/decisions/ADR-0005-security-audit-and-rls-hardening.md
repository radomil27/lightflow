# 5. Sicherheits-Audit & Supabase RLS Härtung

* Datum: 2026-10-15  
* Status: **Akzeptiert**  
* Entscheidungsträger: Chef, Rene (Security Gatekeeper), Thomas (Lead Developer)  

---

## Kontext & Problemstellung
Im Rahmen eines umfassenden Sicherheits-Audits für Lightflow wurde die Datenbankkonfiguration in `supabase/schema.sql` analysiert. Dabei stellte sich heraus, dass die Tabelle `public.feedbacks` permissive Policies (`using (true)`) für SELECT, UPDATE und DELETE aufwies. Dadurch hätte jeder anonyme Client mit dem öffentlichen Anon-Key alle Nutzerfeedbacks im Klartext auslesen oder manipulieren können. Zudem war eine Admin-PIN im Frontend-Code hinterlegt.

## Betrachtete Optionen
1. **Beibehaltung der anonymen Lese-/Löschrechte:** Ernsthaftes Risiko von Datenlecks bei Produktivschaltung von Supabase.
2. **Strikte RLS-Härtung auf `service_role`:**
   * INSERT bleibt anonym erlaubt (Nutzer können Feedback einreichen).
   * SELECT, UPDATE, DELETE werden strikt auf `auth.role() = 'service_role'` begrenzt.
   * Keine anonymen Lese- oder Löschrechte über den Client-Anon-Key.

## Entscheidung
Wir härten `supabase/schema.sql`:
1. `feedbacks`: Nur noch INSERT ist öffentlich. SELECT, UPDATE, DELETE sind exklusiv für `service_role` freigegeben.
2. Bestätigung der serverseitigen Kapselung des `GEMINI_API_KEY` in Vercel Serverless Functions (`api/generate.ts`) ohne Frontend-Exposition (`NEXT_PUBLIC_` / `VITE_`).
3. Verbindliche Einführung des 2-3-Satz-Sicherheitsnachweises für alle zukünftigen Updates.

## Konsequenzen
### Positiv:
* Vollständiger Schutz privater Feedback-Nachrichten vor unbefugtem Auslesen oder Löschen.
* Zero-Leak-Garantie für alle Cloud-Schlüssel.
* Transparenter Sicherheitsnachweis bei jedem weiteren Git-Release.
