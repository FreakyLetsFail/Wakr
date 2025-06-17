"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X,
  Star,
  Phone,
  Brain,
  Target,
  Crown,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLANS = {
  trial: {
    name: "Free Trial",
    price: 0,
    duration: "24 hours",
    description: "Try Wakr for free",
    features: [
      "1 wake call configuration",
      "Basic challenges", 
      "Standard voice",
      "5 habits tracking",
    ],
    limitations: [
      "Limited to 24 hours",
      "No AI personalization",
      "No weather integration",
      "No calendar integration",
    ],
    cta: "Continue with Trial",
    needsCity: false
  },
  basic: {
    name: "Basic",
    price: 12.99,
    duration: "month",
    description: "Perfect for getting started",
    features: [
      "Daily wake calls",
      "5 custom calls per month",
      "All challenge types",
      "10 habits tracking",
      "Basic AI personalization",
      "Email support",
    ],
    limitations: [
      "Limited AI features",
      "No calendar integration",
      "Standard voice quality",
    ],
    cta: "Choose Basic",
    needsCity: false
  },
  pro: {
    name: "Pro",
    price: 24.99,
    duration: "month", 
    description: "For serious morning optimizers",
    features: [
      "Unlimited wake calls",
      "Advanced AI personalization",
      "Weather integration",
      "Calendar integration",
      "Premium voice quality",
      "Unlimited habits tracking",
      "Advanced analytics",
      "Rewards & achievements",
      "Priority support",
      "Smart roaming optimization",
    ],
    limitations: [],
    cta: "Go Pro",
    needsCity: true
  }
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: keyof typeof PLANS) => {
    const plan = PLANS[planKey];
    
    if (plan.needsCity) {
      // Redirect to city selection for Pro plan
      router.push('/subscription/city-selection?plan=pro');
      return;
    }

    setLoading(planKey);
    try {
      // For trial and basic, proceed without city selection
      const response = await fetch('/api/subscription/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planKey,
        }),
      });

      if (response.ok) {
        toast({
          title: "Plan Selected! 🎉",
          description: `You've selected the ${plan.name} plan`,
        });
        router.push('/dashboard');
      } else {
        throw new Error('Failed to select plan');
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start your journey to better mornings. You can upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => {
            const planKey = key as keyof typeof PLANS;
            const isPopular = planKey === 'basic';

            return (
              <Card 
                key={key} 
                className={`relative ${isPopular ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold">Free</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          €{plan.price}
                        </div>
                        <div className="text-muted-foreground">
                          per {plan.duration}
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loading === planKey}
                  >
                    {loading === planKey ? (
                      "Processing..."
                    ) : (
                      <>
                        {planKey === 'pro' && <Crown className="w-4 h-4 mr-2" />}
                        {planKey === 'trial' && <Zap className="w-4 h-4 mr-2" />}
                        {planKey === 'basic' && <Target className="w-4 h-4 mr-2" />}
                        {plan.cta}
                      </>
                    )}
                  </Button>

                  {plan.needsCity && (
                    <p className="text-xs text-center text-muted-foreground">
                      * You'll select your city for weather integration next
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 7-day money-back guarantee
          </p>
          <p className="text-sm text-muted-foreground">
            You can change or cancel your plan anytime from your account settings
          </p>
        </div>
      </div>
    </div>
  );
}