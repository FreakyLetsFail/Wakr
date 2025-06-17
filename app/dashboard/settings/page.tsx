"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  Download,
  Trash2,
  Phone,
  Clock,
  Volume2
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+49123456789",
    timezone: "Europe/Berlin",
    language: "de",
  });

  const [notifications, setNotifications] = useState({
    habitReminders: true,
    dailyPlan: true,
    dailyPlanTime: "07:00",
    soundEnabled: true,
    wakeupVariant: "auto",
  });

  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: false,
    marketing: false,
  });

  const [subscription] = useState({
    tier: "BASIC",
    nextBilling: "2024-12-15",
    amount: "€12.99",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte dein Profil, Benachrichtigungen und Datenschutz
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil
          </CardTitle>
          <CardDescription>
            Deine persönlichen Informationen und Einstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={user.firstName}
                onChange={(e) => setUser(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={user.lastName}
                onChange={(e) => setUser(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              type="tel"
              value={user.phone}
              onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Diese Nummer wird für deine Weckrufe verwendet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Zeitzone</Label>
              <select
                id="timezone"
                value={user.timezone}
                onChange={(e) => setUser(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Sprache</Label>
              <select
                id="language"
                value={user.language}
                onChange={(e) => setUser(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <Button>
            <User className="w-4 h-4 mr-2" />
            Profil aktualisieren
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Benachrichtigungen
          </CardTitle>
          <CardDescription>
            Steuere, wann und wie du benachrichtigt wirst
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Habit-Erinnerungen</div>
              <div className="text-sm text-muted-foreground">
                Erhalte Benachrichtigungen für deine Habits
              </div>
            </div>
            <Switch
              checked={notifications.habitReminders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, habitReminders: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Täglicher Plan</div>
              <div className="text-sm text-muted-foreground">
                Morgendliche Zusammenfassung deiner Termine
              </div>
            </div>
            <Switch
              checked={notifications.dailyPlan}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, dailyPlan: checked }))
              }
            />
          </div>

          {notifications.dailyPlan && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="dailyPlanTime">Zeit für täglichen Plan</Label>
              <Input
                id="dailyPlanTime"
                type="time"
                value={notifications.dailyPlanTime}
                onChange={(e) => 
                  setNotifications(prev => ({ ...prev, dailyPlanTime: e.target.value }))
                }
                className="w-32"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Ton aktiviert</div>
              <div className="text-sm text-muted-foreground">
                Benachrichtigungen mit Ton abspielen
              </div>
            </div>
            <Switch
              checked={notifications.soundEnabled}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, soundEnabled: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Weckruf-Variante</Label>
            <select
              value={notifications.wakeupVariant}
              onChange={(e) => 
                setNotifications(prev => ({ ...prev, wakeupVariant: e.target.value }))
              }
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="auto">Automatisch (basierend auf Tageszeit)</option>
              <option value="gentle">Sanft</option>
              <option value="energetic">Energiegeladen</option>
              <option value="motivational">Motivierend</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Abonnement
          </CardTitle>
          <CardDescription>
            Verwalte dein Wakr-Abonnement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">Aktueller Plan: {subscription.tier}</div>
              <div className="text-sm text-muted-foreground">
                Nächste Abrechnung: {subscription.nextBilling}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{subscription.amount}</div>
              <div className="text-sm text-muted-foreground">pro Monat</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              Plan ändern
            </Button>
            <Button variant="outline">
              Rechnungen anzeigen
            </Button>
          </div>

          {subscription.tier === "TRIAL" && (
            <div className="p-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="font-medium text-orange-800 dark:text-orange-200">
                Trial läuft ab
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Dein Trial endet in 3 Tagen. Upgrade jetzt für alle Features.
              </div>
              <Button className="mt-2" size="sm">
                Jetzt upgraden
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Datenschutz & Sicherheit
          </CardTitle>
          <CardDescription>
            Steuere deine Datenschutz-Einstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Datensammlung für Verbesserungen</div>
              <div className="text-sm text-muted-foreground">
                Helfe uns, Wakr zu verbessern (anonymisiert)
              </div>
            </div>
            <Switch
              checked={privacy.dataCollection}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, dataCollection: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-muted-foreground">
                Nutzungsstatistiken für bessere Funktionen
              </div>
            </div>
            <Switch
              checked={privacy.analytics}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, analytics: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Marketing-E-Mails</div>
              <div className="text-sm text-muted-foreground">
                Informationen über neue Features und Angebote
              </div>
            </div>
            <Switch
              checked={privacy.marketing}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, marketing: checked }))
              }
            />
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-medium">Deine Rechte (DSGVO)</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Daten exportieren
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Datenschutzerklärung
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Gefährlicher Bereich
          </CardTitle>
          <CardDescription>
            Irreversible Aktionen für dein Konto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="font-medium">Account löschen</div>
            <div className="text-sm text-muted-foreground mb-3">
              Alle deine Daten werden permanent gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Account löschen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}