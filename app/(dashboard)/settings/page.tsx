"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell,
  Shield,
  CreditCard,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    hometown: "New York",
  });

  const [notifications, setNotifications] = useState({
    wakeCallReminders: true,
    habitReminders: true,
    achievementNotifications: true,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="hometown">Hometown (for weather)</Label>
                <Input
                  id="hometown"
                  value={profile.hometown}
                  onChange={(e) => setProfile(prev => ({ ...prev, hometown: e.target.value }))}
                  placeholder="e.g., New York, Berlin, Tokyo"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used to provide weather information in your wake-up calls
                </p>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="wakeCallReminders">Wake call reminders</Label>
                <Switch
                  id="wakeCallReminders"
                  checked={notifications.wakeCallReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, wakeCallReminders: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="habitReminders">Habit completion reminders</Label>
                <Switch
                  id="habitReminders"
                  checked={notifications.habitReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, habitReminders: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="achievementNotifications">Achievement notifications</Label>
                <Switch
                  id="achievementNotifications"
                  checked={notifications.achievementNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, achievementNotifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy settings will be available in the next update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Current Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    Trial Plan
                  </p>
                </div>
                <Badge variant="secondary">
                  Trial
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}