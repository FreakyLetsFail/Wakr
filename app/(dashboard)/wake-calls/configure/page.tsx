"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Phone, 
  Brain,
  Volume2,
  Calendar,
  ArrowLeft,
  Save,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", short: "Su" },
  { value: 1, label: "Monday", short: "Mo" },
  { value: 2, label: "Tuesday", short: "Tu" },
  { value: 3, label: "Wednesday", short: "We" },
  { value: 4, label: "Thursday", short: "Th" },
  { value: 5, label: "Friday", short: "Fr" },
  { value: 6, label: "Saturday", short: "Sa" },
];

const CHALLENGE_TYPES = [
  { value: "math", label: "Math Problems", description: "Solve simple arithmetic" },
  { value: "memory", label: "Memory Game", description: "Remember sequences" },
  { value: "captcha", label: "Captcha", description: "Type what you see" },
  { value: "none", label: "No Challenge", description: "Just answer the call" },
];

const VOICE_VARIANTS = [
  { value: "friendly", label: "Friendly", description: "Warm and encouraging" },
  { value: "motivational", label: "Motivational", description: "Energetic and inspiring" },
  { value: "professional", label: "Professional", description: "Clear and formal" },
  { value: "playful", label: "Playful", description: "Fun and casual" },
];

export default function ConfigureWakeCallPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    enabled: true,
    wakeTime: "07:00",
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    challengeType: "math",
    challengeDifficulty: 2,
    snoozeAllowed: true,
    maxSnoozes: 3,
    voiceVariant: "friendly",
    personalMessage: "",
    weatherEnabled: true,
    calendarEnabled: false,
  });

  const handleDayToggle = (day: number) => {
    setConfig(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
    }));
  };

  const handleSave = async () => {
    if (config.daysOfWeek.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one day of the week",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/wake-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "Wake call configured successfully",
        });
        router.push('/wake-calls');
      } else {
        throw new Error('Failed to save wake call configuration');
      }
    } catch (error) {
      console.error('Error saving wake call:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    toast({
      title: "Test Call Initiated",
      description: "You should receive a test call within the next minute",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Configure Wake Call</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Set up your personalized wake-up call experience
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Basic Settings
            </CardTitle>
            <CardDescription>
              Configure when and how often you want to be called
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable wake calls</Label>
              <Switch
                id="enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
              />
            </div>

            <div>
              <Label htmlFor="wakeTime">Wake Time</Label>
              <Input
                id="wakeTime"
                type="time"
                value={config.wakeTime}
                onChange={(e) => setConfig(prev => ({ ...prev, wakeTime: e.target.value }))}
              />
            </div>

            <div>
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.value}
                    variant={config.daysOfWeek.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.short}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="snooze">Allow snooze</Label>
                <Switch
                  id="snooze"
                  checked={config.snoozeAllowed}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, snoozeAllowed: checked }))}
                />
              </div>
              {config.snoozeAllowed && (
                <div>
                  <Label htmlFor="maxSnoozes">Max snoozes</Label>
                  <Select 
                    value={config.maxSnoozes.toString()} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, maxSnoozes: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Challenge Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Wake Challenge
            </CardTitle>
            <CardDescription>
              Add a challenge to help you wake up properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Challenge Type</Label>
              <Select 
                value={config.challengeType} 
                onValueChange={(value) => setConfig(prev => ({ ...prev, challengeType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                  {CHALLENGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {config.challengeType !== "none" && (
              <div>
                <Label>Difficulty Level: {config.challengeDifficulty}/5</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={level <= config.challengeDifficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConfig(prev => ({ ...prev, challengeDifficulty: level }))}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice & Personalization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice & Personalization
            </CardTitle>
            <CardDescription>
              Customize how your wake call sounds and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Voice Variant</Label>
              <Select 
                value={config.voiceVariant} 
                onValueChange={(value) => setConfig(prev => ({ ...prev, voiceVariant: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                  {VOICE_VARIANTS.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      <div>
                        <div className="font-medium">{voice.label}</div>
                        <div className="text-xs text-muted-foreground">{voice.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
              <Textarea
                id="personalMessage"
                placeholder="Add a personal touch to your wake calls..."
                value={config.personalMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, personalMessage: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be included in your wake-up calls
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weather">Include weather</Label>
                  <p className="text-xs text-muted-foreground">Add weather info to your calls</p>
                </div>
                <Switch
                  id="weather"
                  checked={config.weatherEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, weatherEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar">Include calendar</Label>
                  <p className="text-xs text-muted-foreground">Mention today's appointments</p>
                </div>
                <Switch
                  id="calendar"
                  checked={config.calendarEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, calendarEnabled: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Preview
            </CardTitle>
            <CardDescription>
              What your wake call will include
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Time:</strong> {config.wakeTime} on {config.daysOfWeek.map(d => DAYS_OF_WEEK[d].short).join(", ")}
              </p>
              <p className="text-sm">
                <strong>Voice:</strong> {VOICE_VARIANTS.find(v => v.value === config.voiceVariant)?.label}
              </p>
              <p className="text-sm">
                <strong>Challenge:</strong> {CHALLENGE_TYPES.find(c => c.value === config.challengeType)?.label}
                {config.challengeType !== "none" && ` (Level ${config.challengeDifficulty})`}
              </p>
              {config.personalMessage && (
                <p className="text-sm">
                  <strong>Personal message:</strong> "{config.personalMessage}"
                </p>
              )}
              <div className="flex gap-2 text-xs">
                {config.weatherEnabled && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Weather</span>}
                {config.calendarEnabled && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Calendar</span>}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleTest}>
              <TestTube className="w-4 h-4 mr-2" />
              Test This Configuration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Wake Call"}
        </Button>
      </div>
    </div>
  );
}