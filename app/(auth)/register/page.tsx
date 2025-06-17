"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    phoneCountryCode: "+49",
    residenceCountry: "DE",
    hometown: "",
    timezone: "Europe/Berlin",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.hometown.trim()) {
      newErrors.hometown = "City is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
      const { createClient } = await import('@/lib/supabase-client');
      const supabase = createClient();

      // Sign up with Supabase Auth - just email and password for now
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          // Store form data temporarily to complete after email verification
          data: {
            temp_registration_data: {
              first_name: formData.firstName.trim(),
              last_name: formData.lastName.trim(),
              phone: formData.phone.trim(),
              phone_country_code: formData.phoneCountryCode,
              residence_country: formData.residenceCountry,
              hometown: formData.hometown.trim(),
              timezone: formData.timezone,
              subscribe_newsletter: formData.subscribeNewsletter,
              full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        toast({
          title: "Registrierung erfolgreich! 🎉",
          description: "Überprüfe deine E-Mails und klicke auf den Bestätigungslink.",
        });

        // Redirect to email verification page
        router.push('/auth/verify-email');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = EU_COUNTRIES.find(c => c.code === formData.residenceCountry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wakr</span>
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start your free 24-hour trial today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
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
                  <Label htmlFor="lastName">Last Name</Label>
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

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Fields */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={formData.phoneCountryCode} onValueChange={(value) => setFormData({ ...formData, phoneCountryCode: value })}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
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
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.residenceCountry} onValueChange={(value) => setFormData({ ...formData, residenceCountry: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                      {EU_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hometown">City</Label>
                  <Input
                    id="hometown"
                    placeholder="e.g. Dresden, Berlin, Munich..."
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className={errors.hometown ? "border-red-500" : ""}
                  />
                  {errors.hometown && (
                    <p className="text-xs text-red-500 mt-1">{errors.hometown}</p>
                  )}
                  {formData.hometown && (
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll validate this city and auto-detect your timezone
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, subscribeNewsletter: !!checked })}
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm">
                    Subscribe to our newsletter for updates and tips
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}