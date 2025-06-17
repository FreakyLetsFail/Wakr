'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, Mic, QrCode, Smartphone, Volume2, Clock } from 'lucide-react';
import { CHALLENGE_TYPES } from '@/lib/constants';
import type { WakeCallInput } from '@/lib/validations';

interface ChallengeConfigProps {
  config: WakeCallInput;
  onChange: (config: Partial<WakeCallInput>) => void;
  subscriptionTier: 'TRIAL' | 'BASIC' | 'PRO';
}

export function ChallengeConfiguration({ config, onChange, subscriptionTier }: ChallengeConfigProps) {
  const challenges = [
    {
      id: 'none' as const,
      name: 'Kein Challenge',
      description: 'Einfacher Weckruf ohne Aufgabe',
      icon: Volume2,
      available: true,
      difficulty: false
    },
    {
      id: 'math' as const,
      name: 'Mathe-Aufgabe',
      description: 'Löse eine Rechenaufgabe zum Aufwachen',
      icon: Calculator,
      available: true,
      difficulty: true
    },
    {
      id: 'memory' as const,
      name: 'Merkspiel',
      description: 'Merke dir eine Zahlenfolge',
      icon: Brain,
      available: subscriptionTier === 'PRO',
      difficulty: true
    },
    {
      id: 'typing' as const,
      name: 'Text eingeben',
      description: 'Tippe einen vorgegebenen Text',
      icon: Smartphone,
      available: subscriptionTier === 'PRO',
      difficulty: true
    },
    {
      id: 'qr' as const,
      name: 'QR-Code scannen',
      description: 'Scanne einen QR-Code im Badezimmer',
      icon: QrCode,
      available: subscriptionTier === 'PRO',
      difficulty: false
    },
    {
      id: 'shake' as const,
      name: 'Schütteln',
      description: 'Schüttle dein Handy 30 mal',
      icon: Smartphone,
      available: subscriptionTier === 'PRO',
      difficulty: true
    }
  ];

  const difficultyLabels = {
    1: 'Sehr leicht',
    2: 'Leicht', 
    3: 'Mittel',
    4: 'Schwer',
    5: 'Sehr schwer'
  };

  const voiceVariants = [
    { value: 'friendly', label: 'Freundlich' },
    { value: 'energetic', label: 'Energisch' },
    { value: 'calm', label: 'Ruhig' }
  ];

  const handleChallengeTypeChange = (challengeType: typeof config.challengeType) => {
    onChange({ challengeType });
  };

  return (
    <div className="space-y-6">
      {/* Challenge Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Wake-Up Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`relative flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                  config.challengeType === challenge.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${!challenge.available ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={() => challenge.available && handleChallengeTypeChange(challenge.id)}
              >
                <div className={`p-2 rounded-lg ${
                  config.challengeType === challenge.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <challenge.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{challenge.name}</h4>
                    {!challenge.available && (
                      <Badge variant="secondary">PRO</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                {config.challengeType === challenge.id && (
                  <div className="h-4 w-4 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge Difficulty */}
      {config.challengeType !== 'none' && config.challengeType !== 'qr' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schwierigkeit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Schwierigkeitsgrad</Label>
                <Badge variant="outline">
                  {difficultyLabels[config.challengeDifficulty as keyof typeof difficultyLabels]}
                </Badge>
              </div>
              <Slider
                value={[config.challengeDifficulty]}
                onValueChange={([value]) => onChange({ challengeDifficulty: value })}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sehr leicht</span>
                <span>Sehr schwer</span>
              </div>
            </div>

            {config.challengeType === 'math' && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {config.challengeDifficulty === 1 && 'Beispiel: 7 + 5 = ?'}
                  {config.challengeDifficulty === 2 && 'Beispiel: 23 + 17 = ?'}
                  {config.challengeDifficulty === 3 && 'Beispiel: 47 × 3 = ?'}
                  {config.challengeDifficulty === 4 && 'Beispiel: 234 ÷ 6 = ?'}
                  {config.challengeDifficulty === 5 && 'Beispiel: 127 × 13 = ?'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snooze Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schlummern
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Schlummern erlauben</Label>
              <p className="text-sm text-muted-foreground">
                Erlaube das Verschieben des Weckrufs
              </p>
            </div>
            <Switch
              checked={config.snoozeAllowed}
              onCheckedChange={(checked) => onChange({ snoozeAllowed: checked })}
            />
          </div>

          {config.snoozeAllowed && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Schlummer-Dauer</Label>
                  <Badge variant="outline">{config.snoozeDuration} Minuten</Badge>
                </div>
                <Slider
                  value={[config.snoozeDuration]}
                  onValueChange={([value]) => onChange({ snoozeDuration: value })}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Max. Schlummer-Anzahl</Label>
                  <Badge variant="outline">{config.maxSnoozes}x</Badge>
                </div>
                <Slider
                  value={[config.maxSnoozes]}
                  onValueChange={([value]) => onChange({ maxSnoozes: value })}
                  min={1}
                  max={subscriptionTier === 'TRIAL' ? 1 : subscriptionTier === 'BASIC' ? 3 : 10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {subscriptionTier === 'TRIAL' && 'Trial: Max. 1 Schlummer'}
                  {subscriptionTier === 'BASIC' && 'Basic: Max. 3 Schlummer'}
                  {subscriptionTier === 'PRO' && 'Pro: Max. 10 Schlummer'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Stimme & Nachricht
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Stimmen-Geschwindigkeit</Label>
            <Slider
              value={[config.voiceSpeed]}
              onValueChange={([value]) => onChange({ voiceSpeed: value })}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Langsam (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Schnell (2.0x)</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Stimmen-Typ</Label>
            <Select
              value={config.voiceVariant}
              onValueChange={(value: typeof config.voiceVariant) => onChange({ voiceVariant: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                {voiceVariants.map((variant) => (
                  <SelectItem key={variant.value} value={variant.value}>
                    {variant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Benutzerdefinierte Nachricht (optional)</Label>
            <Textarea
              value={config.customMessage || ''}
              onChange={(e) => onChange({ customMessage: e.target.value })}
              placeholder="Guten Morgen! Zeit für einen großartigen Tag..."
              className="min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Diese Nachricht wird zusätzlich zur Standard-Begrüßung abgespielt
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}