export interface ProfessionItem {
  name: string;
  category: string;
  chips: string[];
}

export const PROFESSIONS_DATA: ProfessionItem[] = [
  // --- Handwerk & Bau ---
  {
    name: 'Küchenmonteur / Handwerk',
    category: 'Handwerk & Bau',
    chips: ['Endmontage & Passleisten', 'Altbau & unebene Wände', 'Granit- & Holzarbeiten', 'Wasser- & Elektroanschluss', 'Reklamationen lösen'],
  },
  {
    name: 'Schreiner & Möbelbau',
    category: 'Handwerk & Bau',
    chips: ['Massivholz & Furnier', 'Präzisionszuschnitt', 'Kundenmontage', 'Werkbank & Hobel', 'Oberflächenbehandlung'],
  },
  {
    name: 'Zimmermann & Holzbau',
    category: 'Handwerk & Bau',
    chips: ['Dachstuhl & Abbund', 'Gerüst & Wetterfestigkeit', 'Schwere Balken', 'Richtfest & Teamarbeit', 'Höhenarbeit'],
  },
  {
    name: 'Elektriker & Elektroinstallation',
    category: 'Handwerk & Bau',
    chips: ['Schaltschrank & Verdrahtung', 'Fehlersuche & Kurzschluss', 'Rohbau & Schlitze', 'Sicherheitsprüfung', 'Spannungsfreiheit'],
  },
  {
    name: 'Sanitär-, Heizungs- & Klimatechniker (SHK)',
    category: 'Handwerk & Bau',
    chips: ['Rohrleitungen & Pressfitting', 'Heizkesseltausch', 'Notfalleinsatz & Leckage', 'Kundenbad & Rohbau', 'Wärmepumpen'],
  },
  {
    name: 'Maler & Lackierer',
    category: 'Handwerk & Bau',
    chips: ['Spachteln & Schleifen', 'Farbabstimmung', 'Fassaden & Gerüst', 'Abkleben & Vorbereitung', 'Saubere Kanten'],
  },
  {
    name: 'Maurer & Betonbauer',
    category: 'Handwerk & Bau',
    chips: ['Fundamente & Schalung', 'Kran & Mischwerk', 'Körperliche Ausdauer', 'Mauerwerk im Lot', 'Witterung & Kälte'],
  },
  {
    name: 'Dachdecker & Spengler',
    category: 'Handwerk & Bau',
    chips: ['Steildach & Ziegel', 'Flachdachabdichtung', 'Blech- & Rinnenarbeiten', 'Wind & Wetter', 'Absturzsicherung'],
  },
  {
    name: 'Fliesenleger',
    category: 'Handwerk & Bau',
    chips: ['Großformatfliesen', 'Untergrund & Gefälle', 'Exakte Fugenbilder', 'Badsanierung', 'Knieschoner & Haltung'],
  },
  {
    name: 'Bodenleger & Parkettleger',
    category: 'Handwerk & Bau',
    chips: ['Estrichvorbereitung', 'Parkett schleifen & ölen', 'Trittschalldämmung', 'Sockelleisten', 'Große Flächen'],
  },
  {
    name: 'Bauleiter & Bauingenieur',
    category: 'Handwerk & Bau',
    chips: ['Gewerke-Koordination', 'Bauverzug & Termindruck', 'Mängelprotokoll & Abnahme', 'Budget & Nachkalkulation', 'Baustellenlärm'],
  },
  {
    name: 'Garten- & Landschaftsbauer (GaLaBau)',
    category: 'Handwerk & Bau',
    chips: ['Bagger & Pflasterarbeiten', 'Pflanzplanung', 'Natursteinmauern', 'Körperlicher Einsatz', 'Saisonale Spitzen'],
  },
  {
    name: 'Metallbauer & Schlosser',
    category: 'Handwerk & Bau',
    chips: ['Schweißen & Trennschleifen', 'Geländer & Stahlträger', 'Maßhaltigkeit & Toleranzen', 'Werkstatt & Montage', 'Montagekran'],
  },
  {
    name: 'KFZ-Mechatroniker',
    category: 'Handwerk & Bau',
    chips: ['Fehlerdiagnose & OBD', 'Bremsen & Fahrwerk', 'Motoren & Getriebe', 'Termindruck & Hebebühne', 'Elektromobilität'],
  },
  {
    name: 'Karosseriebauer & Fahrzeuglackierer',
    category: 'Handwerk & Bau',
    chips: ['Ausbeulen & Richtbank', 'Farbtonangleichung', 'Kabinenlackierung', 'Unfallinstandsetzung', 'Finish & Politur'],
  },
  {
    name: 'Glaser & Fensterbauer',
    category: 'Handwerk & Bau',
    chips: ['Schweres Isolierglas', 'Fenstertausch im bewohnten Raum', 'Dichtigkeit & RAL-Montage', 'Schnittgefahr', 'Vakuumheber'],
  },
  {
    name: 'Stuckateur & Trockenbauer',
    category: 'Handwerk & Bau',
    chips: ['Ständerwerk & Rigips', 'Spachteln Q3/Q4', 'Akustikdecken', 'Dämmung & Staub', 'Tempo & Gerüst'],
  },
  {
    name: 'Gerüstbauer',
    category: 'Handwerk & Bau',
    chips: ['Schwere Rüstteile', 'Höhensicherheit', 'Körperliche Kraft', 'Schnelle Montage', 'Wind & Schwindelfreiheit'],
  },
  {
    name: 'Schornsteinfeger & Brandschutzprüfer',
    category: 'Handwerk & Bau',
    chips: ['Feuerstättenschau', 'Emissionsmessung', 'Dachbegehung', 'Beratung & Sicherheit', 'Kundenkontakt an der Haustür'],
  },
  {
    name: 'Raumausstatter & Polsterer',
    category: 'Handwerk & Bau',
    chips: ['Stoffauswahl & Nähen', 'Polstermöbel neu aufbauen', 'Sonnenschutzmontage', 'Kundenberatung vor Ort', 'Fingerspitzengefühl'],
  },

  // --- Luftfahrt & Transport ---
  {
    name: 'Pilot / Flugkapitän',
    category: 'Luftfahrt & Transport',
    chips: ['Langstrecke', 'Kurzstrecke', 'Cockpit-Verantwortung', 'Nachtflug & Zeitzonen', 'Checklisten & Notfallverfahren'],
  },
  {
    name: 'Erster Offizier / Copilot',
    category: 'Luftfahrt & Transport',
    chips: ['Crew Resource Management', 'Wetterbriefing & Routen', 'Sicherheitschecks', 'Simulator-Checks', 'Flugvorbereitung'],
  },
  {
    name: 'Hubschrauberpilot / Rettungsflieger',
    category: 'Luftfahrt & Transport',
    chips: ['Notfalleinsätze', 'Gebirgslandung & Winde', 'Minutenentscheidungen', 'Bereitschaftsdienst', 'Enge Landeplätze'],
  },
  {
    name: 'Fluglotse (Tower / Radar)',
    category: 'Luftfahrt & Transport',
    chips: ['Höchste Konzentration', 'Staffelung im Luftraum', 'Schichtdienst & Pausentakt', 'Schnelle Funksprüche', 'Null-Fehler-Toleranz'],
  },
  {
    name: 'Flugbegleiter / Purser',
    category: 'Luftfahrt & Transport',
    chips: ['Kabinenverantwortung', 'Passagierservice', 'Sicherheitsunterweisung', 'Langstrecken-Müdigkeit', 'Deeskalation an Bord'],
  },
  {
    name: 'Fluggerätmechaniker / Luftfahrttechniker',
    category: 'Luftfahrt & Transport',
    chips: ['Triebwerkswartung', 'Line Maintenance & Zeitdruck', 'Avionik & Hydraulik', 'Strikte Dokumentation', 'Hangar & Nachtschicht'],
  },
  {
    name: 'Lokführer / Triebfahrzeugführer',
    category: 'Luftfahrt & Transport',
    chips: ['Fernverkehr & ICE', 'Güterzug & Nachtschicht', 'Signale & Zugsicherung', 'Unregelmäßiger Dienst', 'Volle Verantwortung allein'],
  },
  {
    name: 'LKW-Fahrer / Fernfahrer',
    category: 'Luftfahrt & Transport',
    chips: ['Fernverkehr & Autobahn', 'Lenk- & Ruhezeiten', 'Terminfracht & Stau', 'Parkplatzsuche am Abend', 'Allein auf Achse'],
  },
  {
    name: 'Busfahrer (ÖPNV / Reiseverkehr)',
    category: 'Luftfahrt & Transport',
    chips: ['Stadtverkehr & Berufsverkehr', 'Fahrgastkontakt', 'Fahrplan einhalten', 'Früh- & Spätdienst', 'Großes Fahrzeug im Engpass'],
  },
  {
    name: 'Kapitän / Nautischer Offizier (Schifffahrt)',
    category: 'Luftfahrt & Transport',
    chips: ['Seefahrt & Hafenmanöver', 'Wochenlange Törns', 'Schiffscrew leiten', 'Sturm & Seegang', 'Ladungssicherheit'],
  },
  {
    name: 'Binnenschiffer',
    category: 'Luftfahrt & Transport',
    chips: ['Flussschifffahrt & Schleusen', 'Familiärer Bordbetrieb', 'Ladungsüberwachung', 'Engstellen & Wasserstände', 'Leben an Bord'],
  },
  {
    name: 'Disponent & Logistikleiter',
    category: 'Luftfahrt & Transport',
    chips: ['Tourenplanung & Engpässe', 'Fahrermangel & Notlösungen', 'Kundenanrufe & Hektik', 'Lagerkapazitäten', 'Permanentes Telefonieren'],
  },
  {
    name: 'Fachkraft für Lagerlogistik & Staplerfahrer',
    category: 'Luftfahrt & Transport',
    chips: ['Hochregallager', 'Kommissionierung & Scan', 'Wareneingang & Kontrolle', 'Schichtarbeit & Tempo', 'Sicherer Hub'],
  },
  {
    name: 'Paketzusteller & Kurierfahrer',
    category: 'Luftfahrt & Transport',
    chips: ['Hohe Stoppzahl pro Stunde', 'Treppensteigen & Pakete', 'Zeitdruck & Verkehr', 'Wetter & Nässe', 'Freundlichkeit an der Tür'],
  },

  // --- Medizin, Pflege & Gesundheit ---
  {
    name: 'Pflegefachkraft / Gesundheits- & Krankenpfleger',
    category: 'Gesundheit & Pflege',
    chips: ['Stationärer Schichtdienst', 'Medikamentenvergabe', 'Patientenkontakt & Würde', 'Unterbesetzung & Eile', 'Übergabe & Dokumentation'],
  },
  {
    name: 'Altenpfleger / Pflegekraft Seniorenheim',
    category: 'Gesundheit & Pflege',
    chips: ['Menschliche Zuwendung', 'Grund- & Behandlungspflege', 'Demenzbegleitung', 'Körperliche Belastung', 'Sterbebegleitung'],
  },
  {
    name: 'Arzt / Facharzt',
    category: 'Gesundheit & Pflege',
    chips: ['Visite & Diagnose', 'Therapieentscheidungen', 'Nacht- & Bereitschaftsdienst', 'Aufklärungsgespräche', 'Bürokratie & Gutachten'],
  },
  {
    name: 'Notarzt & Rettungssanitäter / Notfallsanitäter',
    category: 'Gesundheit & Pflege',
    chips: ['Blaulichteinsatz & Alarm', 'Erstversorgung am Unfallort', 'Unvorhersehbare Lagen', 'Reanimation & Ruhe bewahren', 'Wache & Adrenalin'],
  },
  {
    name: 'Chirurg & OP-Fachkraft',
    category: 'Gesundheit & Pflege',
    chips: ['Stundenlanges Stehen am Tisch', 'Präzise Skalpellführung', 'Sterilität & OP-Team', 'Komplikationen managen', 'Höchste Konzentration'],
  },
  {
    name: 'Hebamme / Entbindungspfleger',
    category: 'Gesundheit & Pflege',
    chips: ['Kreißsaal & Geburtsbegleitung', 'Frauen & Paare ermutigen', 'Unberechenbare Wehenzeiten', 'Neugeborenen-Versorgung', 'Notfallreaktion'],
  },
  {
    name: 'Physiotherapeut',
    category: 'Gesundheit & Pflege',
    chips: ['20-Minuten-Takt', 'Körperliche manuelle Arbeit', 'Reha & Schmerzpatienten', 'Hausaufgaben für Patienten', 'Motivation wecken'],
  },
  {
    name: 'Ergotherapeut',
    category: 'Gesundheit & Pflege',
    chips: ['Alltagsfähigkeiten fördern', 'Motorik & Wahrnehmung', 'Geduld & kleine Fortschritte', 'Therapiepläne anpassen', 'Hausbesuche'],
  },
  {
    name: 'Logopäde',
    category: 'Gesundheit & Pflege',
    chips: ['Sprach- & Schlucktherapie', 'Arbeit mit Kindern & Schlaganfall', 'Wortfindung & Gehör', 'Feinfühlige Förderung', 'Therapieberichte'],
  },
  {
    name: 'Apotheker & PTA',
    category: 'Gesundheit & Pflege',
    chips: ['Rezepturherstellung', 'Kundenberatung am Tresen', 'Wechselwirkungsprüfung', 'Lieferengpässe lösen', 'Notdienst'],
  },
  {
    name: 'Zahnarzt & ZFA',
    category: 'Gesundheit & Pflege',
    chips: ['Angstpatienten beruhigen', 'Präzisionsarbeit im Mundraum', 'Füllungen & Wurzelkanal', 'Strikte Hygiene', 'Ergonomische Haltung'],
  },
  {
    name: 'Psychologe & Psychotherapeut',
    category: 'Gesundheit & Pflege',
    chips: ['Schwere Lebensgeschichten', 'Aktives Zuhören & Resonanz', 'Eigene Abgrenzung wahren', 'Therapiesitzungen im Stundentakt', 'Hoffnung vermitteln'],
  },
  {
    name: 'Medizinisch-technischer Assistent (MTA / MTRA / MTLA)',
    category: 'Gesundheit & Pflege',
    chips: ['Laboranalytik & Blutwerte', 'MRT & CT Bedienen', 'Röntgen & Strahlenschutz', 'Eilige Notfallproben', 'Präzise Messgeräte'],
  },
  {
    name: 'Heilpädagoge & Betreuer Menschen mit Behinderung',
    category: 'Gesundheit & Pflege',
    chips: ['Wohngruppe & Alltagshilfe', 'Inklusion & Förderung', 'Verhaltensauffälligkeiten', 'Echtheit & Vertrauen', 'Kleine Erfolge feiern'],
  },

  // --- IT, Software & Technik ---
  {
    name: 'Software-Entwickler / Programmierer',
    category: 'IT & Technik',
    chips: ['Code-Qualität & Bugs', 'Sprint-Deadline & Tickets', 'Architektur & Refactoring', 'Code Reviews & PRs', 'Lange Fehlersuche'],
  },
  {
    name: 'DevOps & Cloud Engineer',
    category: 'IT & Technik',
    chips: ['CI/CD Pipelines', 'Serverausfall & On-Call', 'Kubernetes & Docker', 'Infrastruktur als Code', 'Stabilität & Monitoring'],
  },
  {
    name: 'Systemadministrator & IT-Support',
    category: 'IT & Technik',
    chips: ['User-Tickets & Druckeranfragen', 'Netzwerkausfall', 'Rechteverwaltung & Active Directory', 'Wochenend-Wartung', 'Geduld mit Anwendern'],
  },
  {
    name: 'IT-Sicherheitsanalyst / Cybersecurity',
    category: 'IT & Technik',
    chips: ['Angriffsvektoren & Patches', 'Incident Response & Alarm', 'Audit & Compliance', 'Mitarbeitersensibilisierung', 'Dauernde Wachsamkeit'],
  },
  {
    name: 'Frontend-Entwickler & UI/UX Designer',
    category: 'IT & Technik',
    chips: ['Responsive Layouts & Mobile', 'User Journey & Usability', 'Design System & Figma', 'Performance & Barrierefreiheit', 'Kundenfeedback einarbeiten'],
  },
  {
    name: 'Data Scientist & KI-Ingenieur',
    category: 'IT & Technik',
    chips: ['Datenbereinigung & Modelle', 'Machine Learning Training', 'Statistische Validierung', 'Dashboards & Insights', 'Erklärbarkeit'],
  },
  {
    name: 'Product Owner & Scrum Master',
    category: 'IT & Technik',
    chips: ['Backlog-Priorisierung', 'Team vermitteln & Blocker lösen', 'Stakeholder-Erwartungen', 'Sprint Retrospektiven', 'Vision vs. Realität'],
  },
  {
    name: 'Datenbankadministrator (DBA)',
    category: 'IT & Technik',
    chips: ['Query-Optimierung & Indizes', 'Backups & Recovery-Test', 'Hochverfügbarkeit', 'Datenkonsistenz', 'Nachtmigrationen'],
  },
  {
    name: 'Hardware- & Elektronikentwickler',
    category: 'IT & Technik',
    chips: ['Schaltplan & Leiterplatte (PCB)', 'Oszilloskop & Lötkolben', 'Prototypenbau', 'EMV-Prüfung', 'Komponentenbeschaffung'],
  },

  // --- Bildung & Pädagogik ---
  {
    name: 'Grundschullehrer',
    category: 'Bildung & Pädagogik',
    chips: ['Primarstufe & Anfangsunterricht', 'Lesen & Rechnen beibringen', 'Elterngespräche', 'Klassenleitung & Disziplin', 'Vorbereitung am Küchentisch'],
  },
  {
    name: 'Lehrer Sekundarstufe / Gymnasium',
    category: 'Bildung & Pädagogik',
    chips: ['Fachunterricht & Korrekturen', 'Pubertät & Motivation', 'Abiturvorbereitung', 'Konferenzen & Schulentwicklung', 'Leistungsdruck moderieren'],
  },
  {
    name: 'Berufsschullehrer',
    category: 'Bildung & Pädagogik',
    chips: ['Duale Ausbildung & Praxisbezug', 'Heterogene Klassen', 'Betriebskooperation', 'Prüfungsvorbereitung', 'Erwachsene Lerner'],
  },
  {
    name: 'Erzieher / Kita-Fachkraft',
    category: 'Bildung & Pädagogik',
    chips: ['Kleinkinder & Bindung', 'Lärmpegel & Multitasking', 'Freispiel & Basteln', 'Dokumentation & Entwicklungsberichte', 'Teamarbeit & Schichten'],
  },
  {
    name: 'Sonderpädagoge / Förderlehrer',
    category: 'Bildung & Pädagogik',
    chips: ['Individuelle Förderpläne', 'Inklusion im Regelunterricht', 'Lernblockaden lösen', 'Geduld im Schneckentempo', 'Enger Elternaustausch'],
  },
  {
    name: 'Dozent / Universitätsprofessor',
    category: 'Bildung & Pädagogik',
    chips: ['Vorlesungen & Seminare', 'Forschung & Publikationen', 'Drittmittelanträge', 'Abschlussarbeiten betreuen', 'Wissenschaftliche Genauigkeit'],
  },
  {
    name: 'Sozialpädagoge / Schulsozialarbeiter',
    category: 'Bildung & Pädagogik',
    chips: ['Krisengespräche & Mobbing', 'Jugendamt & Hilfenetze', 'Offenes Ohr auf dem Schulhof', 'Schlichtung & Mediation', 'Eigene Resilienz wahren'],
  },
  {
    name: 'Fahrlehrer',
    category: 'Bildung & Pädagogik',
    chips: ['Doppelpedale & Eingreifen', 'Nervöse Fahrschüler', 'Verkehrsbeobachtung', 'Theorieunterricht abends', 'Prüfungsangst nehmen'],
  },

  // --- Wirtschaft, Büro & Finanzen ---
  {
    name: 'Kaufmann für Büromanagement & Assistenz',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Terminkoordination & Mails', 'Vorbereitende Buchhaltung', 'Reiseplanung & Meetings', 'Ständige Unterbrechungen', 'Gute Laune am Empfang'],
  },
  {
    name: 'Buchhalter & Bilanzbuchhalter',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Monatsabschluss & Belege', 'Kontenabstimmung auf Cent', 'Umsatzsteuer & Fristen', 'Strikte Genauigkeit', 'Überstunden zum Jahresende'],
  },
  {
    name: 'Steuerberater & Wirtschaftsprüfer',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Steuergesetze & Fristen', 'Mandantengespräche', 'Betriebsprüfungen', 'Gutachten & Strategie', 'Verantwortung bei Unterschrift'],
  },
  {
    name: 'Personalreferent / HR Manager',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Bewerbungsgespräche & Recruiting', 'Arbeitsverträge & Zeugnisse', 'Mitarbeiterkonflikte', 'Kündigungen aussprechen', 'Personalentwicklung'],
  },
  {
    name: 'Projektleiter / Management Consultant',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Meilensteine & Budget', 'Stakeholder & Präsentationen', 'Reisebereitschaft', 'Deadlines & Nachtschichten', 'Team motivieren'],
  },
  {
    name: 'Vertriebsmitarbeiter / Sales Manager',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Kaltakquise & Leads', 'Verkaufsgespräche & Abschlüsse', 'Quartalsziele & Druck', 'Reisezeit im Auto/Zug', 'Ablehnung wegstecken'],
  },
  {
    name: 'Marketing Manager & Content Creator',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Kampagnen & Social Media', 'Analytics & Reichweite', 'Kreative Blockaden', 'Kurze Deadlines & Trends', 'Texte & Bildsprache'],
  },
  {
    name: 'Bankkaufmann / Finanzberater',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Kreditberatung & Baufinanzierung', 'Vorgaben & Regulatorik', 'Geldanlagen & Vertrauen', 'Vertriebsziele der Filiale', 'Diskrete Gespräche'],
  },
  {
    name: 'Versicherungskaufmann / Makler',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Schadensregulierung im Ernstfall', 'Kundenberatung & Vorsorge', 'Bedingungswerke prüfen', 'Dauerhafter Kundenkontakt', 'Bestandsbetreuung'],
  },
  {
    name: 'Einkäufer / Supply Chain Manager',
    category: 'Wirtschaft & Verwaltung',
    chips: ['Lieferantenverhandlungen & Preise', 'Lieferengpässe überbrücken', 'Qualitätskontrolle', 'Vertragsgestaltung', 'Kostenoptimierung'],
  },

  // --- Recht, Sicherheit & Öffentlicher Dienst ---
  {
    name: 'Polizist / Streifenbeamter',
    category: 'Sicherheit & Recht',
    chips: ['Streifenfahrt & Notruf', 'Unberechenbare Einsätze', 'Schichtdienst rund um die Uhr', 'Deeskalation & Eigenschutz', 'Protokolle schreiben'],
  },
  {
    name: 'Kriminalbeamter / Ermittler',
    category: 'Sicherheit & Recht',
    chips: ['Tatortarbeit & Vernehmungen', 'Aktenstudium & Beweise', 'Geduldige Spurensuche', 'Schwere Schicksale', 'Staatsanwaltschaft'],
  },
  {
    name: 'Feuerwehrmann (Berufsfeuerwehr)',
    category: 'Sicherheit & Recht',
    chips: ['Brandbekämpfung unter Atemschutz', 'Technische Hilfeleistung', '24-Stunden-Wachdienst', 'Warten auf den Gong', 'Kameradschaft'],
  },
  {
    name: 'Rechtsanwalt / Jurist',
    category: 'Sicherheit & Recht',
    chips: ['Schriftsätze an Gerichte', 'Fristensachen & Notfristen', 'Mandanten beruhigen', 'Verhandlungen im Gerichtssaal', 'Hohe Aktenberge'],
  },
  {
    name: 'Richter & Staatsanwalt',
    category: 'Sicherheit & Recht',
    chips: ['Urteilsfindung im Zweifel', 'Hauptverhandlungen leiten', 'Schwere Entscheidungen allein', 'Unabhängigkeit wahren', 'Gesetzesauslegung'],
  },
  {
    name: 'Justizvollzugsbeamter (JVA)',
    category: 'Sicherheit & Recht',
    chips: ['Sicherheitskontrollen & Zählung', 'Umgang mit Inhaftierten', 'Wachsamkeit hinter Gittern', 'Deeskalation im Gang', 'Feste Dienstpläne'],
  },
  {
    name: 'Soldat / Offizier (Bundeswehr / Heer)',
    category: 'Sicherheit & Recht',
    chips: ['Führen & Befehle umsetzen', 'Körperliche Härte & Gelände', 'Einsatz & Trennung von Familie', 'Kameradschaft & Loyalität', 'Verantwortung für Untergebene'],
  },
  {
    name: 'Verwaltungsfachangestellter / Beamter',
    category: 'Sicherheit & Recht',
    chips: ['Bürgerkontakt am Schalter', 'Bescheide nach Vorschrift', 'Antragsflut & Gesetzesänderung', 'Bürokratische Abläufe', 'Sachliche Neutralität'],
  },
  {
    name: 'Sicherheitsmitarbeiter & Wachdienst',
    category: 'Sicherheit & Recht',
    chips: ['Objektschutz & Rundgänge', 'Nachtschicht & Alleinsein', 'Einlasskontrollen', 'Wachsamkeit gegen Müdigkeit', 'Präsenz zeigen'],
  },

  // --- Gastronomie, Hotellerie & Lebensmittel ---
  {
    name: 'Koch / Küchenchef',
    category: 'Gastronomie & Küche',
    chips: ['À-la-carte-Stoßzeit', 'Hitze am Herd & Tempo', 'Mise en place vor dem Service', 'Zutaten & Frischekontrolle', 'Körperliche Anspannung'],
  },
  {
    name: 'Restaurantfachkraft & Service',
    category: 'Gastronomie & Küche',
    chips: ['Viele Tische gleichzeitig', 'Freundlichkeit trotz Hektik', 'Tabletts & schwere Teller', 'Späte Abende & Wochenenden', 'Zufriedene Gäste'],
  },
  {
    name: 'Bäcker & Konditor',
    category: 'Gastronomie & Küche',
    chips: ['Arbeitsbeginn 2:00 Uhr nachts', 'Teigführung & Mehlstaub', 'Heiße Backöfen', 'Handwerkliche Präzision', 'Wenn die Stadt noch schläft'],
  },
  {
    name: 'Fleischer & Metzger',
    category: 'Gastronomie & Küche',
    chips: ['Kühlhaus & Schärfe', 'Zerlegung & Zuschnitt', 'Wurstherstellung & Rezepturen', 'Körperkraft & Frische', 'Verkauf an der Theke'],
  },
  {
    name: 'Hotelfachmann / Rezeptionist',
    category: 'Gastronomie & Küche',
    chips: ['Check-in & Abreise', 'Gästewünsche erfüllen', 'Schichtdienst Tag & Nacht', 'Beschwerden deeskalieren', 'Erster Eindruck des Hauses'],
  },
  {
    name: 'Barista & Barkeeper',
    category: 'Gastronomie & Küche',
    chips: ['Espressomaschine & Siebträger', 'Cocktails zur Stoßzeit', 'Laufkundschaft & Plausch', 'Lange Nächte im Stehen', 'Multitasking an der Bar'],
  },

  // --- Landwirtschaft, Natur & Tiere ---
  {
    name: 'Landwirt & Landwirtin',
    category: 'Landwirtschaft & Natur',
    chips: ['Ernte & Wetterfenster', 'Schlepper & Bodenbearbeitung', 'Viehhaltung 365 Tage', 'Bürokratie & Auflagen', 'Frühes Aufstehen'],
  },
  {
    name: 'Förster & Forstwirt',
    category: 'Landwirtschaft & Natur',
    chips: ['Motorsäge & Holzernte', 'Waldumbau & Klimafolgen', 'Jagd & Hege', 'Allein im Revier', 'Sturmschäden aufarbeiten'],
  },
  {
    name: 'Tierarzt & Tiermedizinischer Fachangestellter',
    category: 'Landwirtschaft & Natur',
    chips: ['Notfälle bei Groß- & Kleintieren', 'Besitzer emotional begleiten', 'OPs & Diagnostik', 'Nacht- & Notdienste', 'Körperlicher Einsatz am Tier'],
  },
  {
    name: 'Winzer & Weinbauer',
    category: 'Landwirtschaft & Natur',
    chips: ['Rebschnitt im Winter', 'Laubarbeit & Steillagen', 'Traubenlese im Herbst', 'Kellerwirtschaft & Gärung', 'Naturabhängigkeit'],
  },

  // --- Dienstleistung, Kreatives & Sonstiges ---
  {
    name: 'Friseur & Stylist',
    category: 'Dienstleistung & Kreatives',
    chips: ['Stundenlanges Stehen', 'Haarschnitt & Farbchemie', 'Persönliche Lebensgeschichten der Kunden', 'Termintaktung', 'Kreatives Handwerk'],
  },
  {
    name: 'Gebäudereiniger & Reinigungskraft',
    category: 'Dienstleistung & Kreatives',
    chips: ['Frühe Morgenstunden / Spätschicht', 'Körperliche Anstrengung', 'Unsichtbare Sauberkeit', 'Große Flächen & Maschinen', 'Oft übersehene Arbeit'],
  },
  {
    name: 'Fotograf & Videograf',
    category: 'Dienstleistung & Kreatives',
    chips: ['Licht & Bildkomposition', 'Stundenlange Nachbearbeitung', 'Wochenendaufträge & Hochzeiten', 'Kundenanweisungen umsetzen', 'Teures Equipment'],
  },
  {
    name: 'Grafikdesigner & Illustrator',
    category: 'Dienstleistung & Kreatives',
    chips: ['Kreativität auf Knopfdruck', 'Feedbackschleifen & Korrekturen', 'Farbprofile & Druckdaten', 'Freelance-Unsicherheit', 'Visuelle Identität'],
  },
  {
    name: 'Journalist & Redakteur',
    category: 'Dienstleistung & Kreatives',
    chips: ['Recherche & Quellencheck', 'Redaktionsschluss im Nacken', 'Artikel auf den Punkt bringen', 'Interviews führen', 'Öffentliche Kritik aushalten'],
  },
  {
    name: 'Übersetzer & Dolmetscher',
    category: 'Dienstleistung & Kreatives',
    chips: ['Simultan-Konzentration', 'Nuancen zweier Sprachen', 'Fachterminologie', 'Isolierte Bildschirmarbeit', 'Exaktes Wortmaß'],
  },
  {
    name: 'Bestatter & Trauerbegleiter',
    category: 'Dienstleistung & Kreatives',
    chips: ['Verstorbene würdevoll versorgen', 'Trauernde Angehörige auffangen', 'Tag- & Nachtbereitschaft', 'Beerdigungen organisieren', 'Umgang mit Endlichkeit'],
  },
  {
    name: 'Pastor / Pfarrer / Seelsorger',
    category: 'Dienstleistung & Kreatives',
    chips: ['Predigtvorbereitung', 'Seelsorge & schwere Lebenskrisen', 'Gemeindeleitung & Erwartungen', 'Beerdigungen & Taufen', 'Eigene geistliche Quelle bewahren'],
  },
  {
    name: 'Missionar & Gemeinde-Mitarbeiter',
    category: 'Dienstleistung & Kreatives',
    chips: ['Pionierarbeit & Beziehungsaufbau', 'Kulturelle Anpassung', 'Unterstützerkreis & Finanzen', 'Geduld ohne schnelle Früchte', 'Leben für andere'],
  },
];
