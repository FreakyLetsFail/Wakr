# Wakr.app Implementation Assistant

Ich möchte, dass du als mein Senior Full-Stack Developer für die Implementierung von Wakr.app agierst. 

## Deine Aufgabe:

1. **Analysiere** das aktuelle Projekt-Verzeichnis und erkenne:
   - Welche Dateien bereits existieren
   - Welche Dependencies installiert sind
   - Welche Features bereits implementiert sind
   - Was noch fehlt

2. **Erstelle eine TODO-Liste** basierend auf:
   - Der beigefügten Claude.MD Dokumentation (vollständige Projektspezifikation)
   - Dem aktuellen Projektstatus
   - Priorisiert nach Wichtigkeit für einen MVP-Launch

3. **Implementiere systematisch** die Features:
   - Beginne mit der Basis (Setup, Datenbank, Auth)
   - Dann Core Features (Wake Calls, Habits)
   - Dann UI/UX
   - Zuletzt Optimierungen

## Wichtige Anforderungen:

### Tech Stack:
- Next.js 15.3.3 mit App Router
- TypeScript (strict mode)
- Drizzle ORM mit PostgreSQL (Supabase)
- tRPC für Type-Safe APIs
- Tailwind CSS + shadcn/ui
- NextAuth.js v5 für Authentication
- Twilio für Anrufe
- Stripe + PayPal für Zahlungen

### Projekt-Struktur:
Folge EXAKT der Struktur aus der Claude.MD. Erstelle alle Ordner und Dateien wie dort beschrieben.

### Coding Standards:
- Verwende async/await (Next.js 15 Pattern)
- Implementiere proper Error Handling
- Schreibe Type-Safe Code
- Kommentiere komplexe Logik
- Verwende die neuen Next.js 15 Features (PPR, Server Components)

### Besondere Features:
1. **Wake-Up Challenges**: WebApp-basiert für Basic, Telefon-Option für Pro
2. **Coin System**: Mit Achievements und Leaderboard
3. **EU-Only**: Geo-Blocking für Non-EU Länder
4. **GDPR**: Vollständige Compliance mit Verschlüsselung
5. **PWA**: Mit Service Worker und Push Notifications

## Arbeitsweise:

1. **Status Check**: 
   ```bash
   # Zeige mir zuerst den aktuellen Status
   find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.json" | head -20
   cat package.json

TODO Erstellung: Erstelle eine strukturierte TODO-Liste mit:

 Setup & Configuration
 Database Schema
 Authentication
 Core Features
 UI Implementation
 Testing & Deployment


Schrittweise Implementation:

Frage bei Unklarheiten nach
Zeige mir wichtige Code-Snippets zur Bestätigung
Teste kritische Features
Committe regelmäßig mit aussagekräftigen Messages


Qualitätssicherung:

Überprüfe TypeScript Errors
Stelle sicher, dass alle Imports korrekt sind
Validiere API Endpoints
Teste UI Komponenten



Start-Kommando:
Beginne mit:

Projekt-Analyse und Status-Report
Detaillierte TODO-Liste basierend auf Claude.MD
Frage mich, wo ich anfangen möchte


WICHTIG: Die Claude.MD Datei enthält die KOMPLETTE Spezifikation mit:

Vollständiger Dateistruktur
Komplettem Datenbank-Schema
Alle UI Components
Alle API Endpoints
Rechtliche Dokumente
Konfigurationsdateien

Nutze sie als deine Bibel für dieses Projekt!

## Zusätzliche Tipps für die Arbeit mit Claude Code:

1. **Lade die Claude.MD hoch** als erste Aktion
2. **Strukturiertes Vorgehen**: Lass Claude Code immer erst analysieren, dann planen, dann implementieren
3. **Regelmäßige Checkpoints**: Lass dir nach jedem größeren Feature den Status zeigen
4. **Git Commits**: Lass Claude Code sinnvolle Commits machen:
   ```bash
   git add .
   git commit -m "feat: implement wake-up call system with Twilio integration"

Environment Variables: Erstelle eine .env.example mit allen benötigten Variablen
