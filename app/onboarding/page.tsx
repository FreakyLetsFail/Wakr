"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase-client";

const EU_COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪", phone: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", phone: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phone: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phone: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", phone: "+31" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", phone: "+32" },
  { code: "AT", name: "Austria", flag: "🇦🇹", phone: "+43" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", phone: "+41" },
  { code: "PL", name: "Poland", flag: "🇵🇱", phone: "+48" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", phone: "+420" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", phone: "+36" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", phone: "+46" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", phone: "+45" },
  { code: "FI", name: "Finland", flag: "🇫🇮", phone: "+358" },
  { code: "NO", name: "Norway", flag: "🇳🇴", phone: "+47" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", phone: "+353" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phone: "+351" },
  { code: "GR", name: "Greece", flag: "🇬🇷", phone: "+30" },
];

const EU_TIMEZONES = [
  { value: "Europe/Berlin", label: "Berlin (CET/UTC+1)" },
  { value: "Europe/Paris", label: "Paris (CET/UTC+1)" },
  { value: "Europe/Rome", label: "Rome (CET/UTC+1)" },
  { value: "Europe/Madrid", label: "Madrid (CET/UTC+1)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET/UTC+1)" },
  { value: "Europe/Vienna", label: "Vienna (CET/UTC+1)" },
  { value: "Europe/Warsaw", label: "Warsaw (CET/UTC+1)" },
  { value: "Europe/Prague", label: "Prague (CET/UTC+1)" },
  { value: "Europe/Budapest", label: "Budapest (CET/UTC+1)" },
  { value: "Europe/Stockholm", label: "Stockholm (CET/UTC+1)" },
  { value: "Europe/Copenhagen", label: "Copenhagen (CET/UTC+1)" },
  { value: "Europe/Helsinki", label: "Helsinki (EET/UTC+2)" },
  { value: "Europe/Athens", label: "Athens (EET/UTC+2)" },
  { value: "Europe/Dublin", label: "Dublin (GMT/UTC+0)" },
  { value: "Europe/London", label: "London (GMT/UTC+0)" },
  { value: "Europe/Lisbon", label: "Lisbon (WET/UTC+0)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    phoneCountryCode: "+49",
    residenceCountry: "DE",
    hometown: "",
    timezone: "Europe/Berlin",
    subscribeNewsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Pre-fill form with existing data
        setFormData(prev => ({
          ...prev,
          firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "",
          lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
          phone: user.user_metadata?.phone || "",
          phoneCountryCode: user.user_metadata?.phone_country_code || "+49",
          residenceCountry: user.user_metadata?.residence_country || "DE",
          hometown: user.user_metadata?.hometown || "",
          timezone: user.user_metadata?.timezone || "Europe/Berlin",
          subscribeNewsletter: user.user_metadata?.subscribe_newsletter || false,
        }));
      } else {
        router.push('/login');
      }
    };

    getUser();
  }, [supabase, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.hometown.trim()) {
      newErrors.hometown = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim(),
          phone_country_code: formData.phoneCountryCode,
          residence_country: formData.residenceCountry,
          hometown: formData.hometown.trim(),
          timezone: formData.timezone,
          subscribe_newsletter: formData.subscribeNewsletter,
          full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          onboarding_completed: true,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Profil vervollständigt! 🎉",
        description: "Willkommen bei Wakr! Du kannst jetzt loslegen.",
      });

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Fehler beim Speichern",
        description: error instanceof Error ? error.message : "Bitte versuche es noch einmal.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wakr</span>
          </div>
        </div>

        {/* Onboarding Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Willkommen bei Wakr! 🎉</CardTitle>
            <CardDescription>
              Vervollständige dein Profil um loszulegen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <div className="flex gap-2">
                  <Select value={formData.phoneCountryCode} onValueChange={(value) => setFormData({ ...formData, phoneCountryCode: value })}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EU_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.phone}>
                          {country.flag} {country.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Land</Label>
                  <Select value={formData.residenceCountry} onValueChange={(value) => setFormData({ ...formData, residenceCountry: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EU_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hometown">Stadt</Label>
                  <Input
                    id="hometown"
                    placeholder="z.B. Dresden, Berlin, München..."
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className={errors.hometown ? "border-red-500" : ""}
                  />
                  {errors.hometown && (
                    <p className="text-xs text-red-500 mt-1">{errors.hometown}</p>
                  )}
                </div>
              </div>

              {/* Timezone */}
              <div>
                <Label htmlFor="timezone">Zeitzone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EU_TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Newsletter Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => setFormData({ ...formData, subscribeNewsletter: !!checked })}
                />
                <Label htmlFor="subscribeNewsletter" className="text-sm">
                  Newsletter für Updates und Tipps abonnieren
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  "Profil vervollständigen"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}