"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin,
  Search,
  Check,
  Crown,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface City {
  id: number | string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export default function CitySelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const plan = searchParams.get('plan') || 'pro';

  // Fetch cities when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchCities(searchTerm);
    } else {
      setCities([]);
    }
  }, [searchTerm]);

  const fetchCities = async (query: string) => {
    setLoading(true);
    try {
      // Using a free cities API - you can replace with your preferred service
      const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      } else {
        throw new Error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity({
      ...city,
      timezone: city.timezone || 'Europe/Berlin' // Add timezone to city
    });
    setSearchTerm(city.name);
    setCities([]);
  };

  const handleSubmit = async () => {
    if (!selectedCity) {
      toast({
        title: "Please select a city",
        description: "Choose your hometown for weather integration",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/subscription/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          city: {
            name: selectedCity.name,
            country: selectedCity.country,
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude,
            timezone: selectedCity.timezone,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: "Welcome to Wakr Pro! 🎉",
          description: `Your plan is active with weather for ${selectedCity.name}`,
        });
        router.push('/dashboard');
      } else {
        throw new Error('Failed to complete setup');
      }
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return cities.slice(0, 8); // Limit to 8 results
  }, [cities, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to plans
            </Button>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold">Wakr Pro Setup</h1>
            </div>
            <p className="text-muted-foreground">
              Select your hometown to enable weather integration in your wake-up calls
            </p>
          </div>

          {/* City Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Choose Your City
              </CardTitle>
              <CardDescription>
                We'll use this to provide accurate weather information in your personalized wake-up calls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="citySearch">Search for your city</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="citySearch"
                    placeholder="Type your city name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Searching cities...</p>
                </div>
              )}

              {/* Cities Results */}
              {filteredCities.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <Label>Search Results</Label>
                  {filteredCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                        selectedCity?.id === city.id ? 'border-primary bg-accent' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {city.region}, {city.country}
                          </p>
                        </div>
                        {selectedCity?.id === city.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected City Display */}
              {selectedCity && (
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Selected: {selectedCity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCity.region}, {selectedCity.country}
                      </p>
                      {selectedCity.timezone && (
                        <p className="text-xs text-muted-foreground">
                          Timezone: {selectedCity.timezone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchTerm.length >= 2 && !loading && filteredCities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No cities found for "{searchTerm}". Try a different spelling or a larger city nearby.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedCity || submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    "Setting up your account..."
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Complete Pro Setup
                    </>
                  )}
                </Button>
                
                {selectedCity && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Weather data will be sourced from {selectedCity.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">What you get with Pro + Weather:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Current weather conditions in your wake-up calls
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Weather-based AI personalization (sunny, rainy, cold days)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Smart outfit suggestions based on weather
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  All other Pro features (unlimited calls, calendar, etc.)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}