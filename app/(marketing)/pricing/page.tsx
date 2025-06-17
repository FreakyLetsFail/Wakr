"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  X,
  Star,
  Phone,
  Brain,
  Target,
  Gift,
  Crown,
  Zap
} from "lucide-react";
import { useAuth } from "@/providers/session-provider";
import { useRouter } from "next/navigation";
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
      "Weather integration",
      "5 habits tracking",
    ],
    limitations: [
      "Limited to 24 hours",
      "No AI personalization",
      "No calendar integration",
      "No premium voices",
    ],
    cta: "Start Free Trial",
    popular: false
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
      "Weather integration",
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
    popular: false
  },
  pro: {
    name: "Pro",
    price: 24.99,
    duration: "month",
    description: "For serious morning optimizers",
    features: [
      "Unlimited wake calls",
      "Advanced AI personalization",
      "Calendar integration",
      "Premium voice quality",
      "Unlimited habits tracking",
      "Advanced analytics",
      "Rewards & achievements",
      "Priority support",
      "Smart roaming optimization",
      "Custom voice messages",
    ],
    limitations: [],
    cta: "Go Pro",
    popular: true
  }
};

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const getPrice = (plan: keyof typeof PLANS) => {
    const basePrice = PLANS[plan].price;
    if (isYearly && basePrice > 0) {
      return Math.round(basePrice * 12 * 0.83); // 17% discount
    }
    return basePrice;
  };

  const handleSubscribe = async (planKey: keyof typeof PLANS) => {
    if (!user) {
      router.push('/login?callbackUrl=/pricing');
      return;
    }

    if (planKey === 'trial') {
      router.push('/register');
      return;
    }

    setLoading(planKey);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planKey === 'basic' ? 'price_basic' : 'price_pro',
          isYearly,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // TODO: Get subscription tier from user profile
  const currentTier = 'TRIAL'; // Default for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your mornings with AI-powered wake calls, habit tracking, and smart optimization
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => {
            const planKey = key as keyof typeof PLANS;
            const price = getPrice(planKey);
            const isCurrentPlan = (currentTier === 'TRIAL' && planKey === 'trial') ||
                                 (currentTier === 'BASIC' && planKey === 'basic') ||
                                 (currentTier === 'PRO' && planKey === 'pro');

            return (
              <Card 
                key={key} 
                className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''} ${isCurrentPlan ? 'bg-muted/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    {price === 0 ? (
                      <div className="text-4xl font-bold">Free</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">
                          €{isYearly ? Math.round(price / 12) : price}
                        </div>
                        <div className="text-muted-foreground">
                          per {isYearly ? 'month (billed yearly)' : plan.duration}
                        </div>
                        {isYearly && price > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            Save €{Math.round((PLANS[planKey].price * 12) - price)} per year
                          </div>
                        )}
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
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loading === planKey || isCurrentPlan}
                  >
                    {loading === planKey ? (
                      "Processing..."
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {[
                {
                  category: "Wake Calls",
                  icon: <Phone className="w-5 h-5" />,
                  features: [
                    { name: "Daily wake calls", trial: false, basic: true, pro: true },
                    { name: "Custom call scheduling", trial: false, basic: "5/month", pro: "Unlimited" },
                    { name: "AI personalization", trial: false, basic: "Basic", pro: "Advanced" },
                    { name: "Premium voices", trial: false, basic: false, pro: true },
                    { name: "Smart roaming", trial: false, basic: false, pro: true },
                  ]
                },
                {
                  category: "Challenges",
                  icon: <Brain className="w-5 h-5" />,
                  features: [
                    { name: "Math problems", trial: true, basic: true, pro: true },
                    { name: "Memory games", trial: false, basic: true, pro: true },
                    { name: "Custom challenges", trial: false, basic: false, pro: true },
                    { name: "Difficulty scaling", trial: false, basic: false, pro: true },
                  ]
                },
                {
                  category: "Habits & Analytics",
                  icon: <Target className="w-5 h-5" />,
                  features: [
                    { name: "Habit tracking", trial: "5 habits", basic: "10 habits", pro: "Unlimited" },
                    { name: "GitHub-style grid", trial: true, basic: true, pro: true },
                    { name: "Advanced analytics", trial: false, basic: false, pro: true },
                    { name: "Progress insights", trial: false, basic: false, pro: true },
                  ]
                },
                {
                  category: "Gamification",
                  icon: <Gift className="w-5 h-5" />,
                  features: [
                    { name: "Coins & rewards", trial: false, basic: true, pro: true },
                    { name: "Achievements", trial: false, basic: "Basic", pro: "All" },
                    { name: "Leaderboards", trial: false, basic: false, pro: true },
                    { name: "Premium rewards", trial: false, basic: false, pro: true },
                  ]
                }
              ].map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="grid grid-cols-4 gap-4 items-center">
                          <div className="text-sm font-medium">{feature.name}</div>
                          <div className="text-center">
                            {feature.trial === true ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : feature.trial === false ? (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{feature.trial}</span>
                            )}
                          </div>
                          <div className="text-center">
                            {feature.basic === true ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : feature.basic === false ? (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{feature.basic}</span>
                            )}
                          </div>
                          <div className="text-center">
                            {feature.pro === true ? (
                              <Check className="w-4 h-4 text-green-500 mx-auto" />
                            ) : feature.pro === false ? (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{feature.pro}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Do wake calls work internationally?",
                a: "Yes! Our smart roaming feature automatically selects local phone numbers to minimize costs when you travel."
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your data is fully exportable at any time. We'll keep your account for 30 days after cancellation in case you want to reactivate."
              },
              {
                q: "Are there any setup fees?",
                a: "No setup fees, no contracts. Just simple monthly or yearly billing."
              },
              {
                q: "How does the free trial work?",
                a: "Start with a 24-hour free trial with full access to basic features. No credit card required."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Mornings?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who've already optimized their wake-up routine with Wakr
              </p>
              <Button size="lg" onClick={() => handleSubscribe('trial')}>
                <Zap className="w-4 h-4 mr-2" />
                Start Your Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}