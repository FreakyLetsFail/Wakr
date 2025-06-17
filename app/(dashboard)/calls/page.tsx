"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Phone, 
  Plus, 
  Clock, 
  Calendar,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2
} from "lucide-react";

export default function CallsPage() {
  const [wakeCalls, setWakeCalls] = useState([
    {
      id: 1,
      enabled: true,
      time: "07:00",
      daysOfWeek: [1, 2, 3, 4, 5], // Mo-Fr
      requiresTask: true,
      taskPrompt: "Was ist dein Hauptziel für heute?",
      voiceLanguage: "de",
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCall, setNewCall] = useState({
    time: "07:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    requiresTask: false,
    taskPrompt: "",
    voiceLanguage: "de",
  });

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const toggleDay = (dayIndex: number) => {
    setNewCall(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayIndex)
        ? prev.daysOfWeek.filter(d => d !== dayIndex)
        : [...prev.daysOfWeek, dayIndex]
    }));
  };

  const toggleCallEnabled = (callId: number) => {
    setWakeCalls(prev => 
      prev.map(call => 
        call.id === callId 
          ? { ...call, enabled: !call.enabled }
          : call
      )
    );
  };

  const formatDays = (days: number[]) => {
    if (days.length === 7) return "Täglich";
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return "Mo-Fr";
    if (days.length === 2 && days.includes(0) && days.includes(6)) return "Wochenende";
    return days.map(d => dayNames[d]).join(", ");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weckrufe</h1>
          <p className="text-muted-foreground">
            Verwalte deine personalisierten Weckzeiten
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Neuer Weckruf
        </Button>
      </div>

      {/* Existing Wake Calls */}
      <div className="space-y-4">
        {wakeCalls.map((call) => (
          <Card key={call.id} className={`border-2 ${call.enabled ? 'border-primary/20' : 'border-muted'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{call.time} Uhr</CardTitle>
                    <CardDescription>{formatDays(call.daysOfWeek)}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={call.enabled}
                    onCheckedChange={() => toggleCallEnabled(call.id)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {call.enabled ? "Aktiv" : "Pausiert"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Sprache: {call.voiceLanguage === 'de' ? 'Deutsch' : 'Englisch'}</span>
                  </div>
                  {call.requiresTask && (
                    <div className="flex items-start gap-2 text-sm">
                      <Play className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Aufgabe erforderlich</div>
                        <div className="text-muted-foreground">{call.taskPrompt}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Löschen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {wakeCalls.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Phone className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Noch keine Weckrufe</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Erstelle deinen ersten Weckruf und starte produktiv in den Tag
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ersten Weckruf erstellen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Neuen Weckruf erstellen</CardTitle>
            <CardDescription>
              Konfiguriere deinen personalisierten Weckruf
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">Weckzeit</Label>
              <Input
                id="time"
                type="time"
                value={newCall.time}
                onChange={(e) => setNewCall(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            {/* Days Selection */}
            <div className="space-y-2">
              <Label>Wochentage</Label>
              <div className="flex gap-2">
                {dayNames.map((day, index) => (
                  <Button
                    key={index}
                    variant={newCall.daysOfWeek.includes(index) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(index)}
                    className="w-12 h-12 p-0"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label>Sprache</Label>
              <div className="flex gap-2">
                <Button
                  variant={newCall.voiceLanguage === "de" ? "default" : "outline"}
                  onClick={() => setNewCall(prev => ({ ...prev, voiceLanguage: "de" }))}
                >
                  Deutsch
                </Button>
                <Button
                  variant={newCall.voiceLanguage === "en" ? "default" : "outline"}
                  onClick={() => setNewCall(prev => ({ ...prev, voiceLanguage: "en" }))}
                >
                  English
                </Button>
              </div>
            </div>

            {/* Task Requirement */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requiresTask">Aufgabe erforderlich</Label>
                  <p className="text-sm text-muted-foreground">
                    Stelle eine Frage, die beantwortet werden muss
                  </p>
                </div>
                <Switch
                  id="requiresTask"
                  checked={newCall.requiresTask}
                  onCheckedChange={(checked) => setNewCall(prev => ({ ...prev, requiresTask: checked }))}
                />
              </div>

              {newCall.requiresTask && (
                <div className="space-y-2">
                  <Label htmlFor="taskPrompt">Aufgaben-Prompt</Label>
                  <Input
                    id="taskPrompt"
                    value={newCall.taskPrompt}
                    onChange={(e) => setNewCall(prev => ({ ...prev, taskPrompt: e.target.value }))}
                    placeholder="z.B. Was ist dein Hauptziel für heute?"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Weckruf erstellen
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipps für bessere Weckrufe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div>
              <div className="font-medium">Konstante Zeiten</div>
              <div className="text-sm text-muted-foreground">
                Verwende die gleiche Weckzeit, auch am Wochenende, für besseren Schlafrhythmus
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div>
              <div className="font-medium">Aufgaben nutzen</div>
              <div className="text-sm text-muted-foreground">
                Aktiviere Aufgaben, um sicherzustellen, dass du wirklich wach bist
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div>
              <div className="font-medium">Pro-Features</div>
              <div className="text-sm text-muted-foreground">
                Upgrade zu Pro für Wetter-Integration und KI-personalisierte Nachrichten
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}