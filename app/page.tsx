import Link from "next/link";
import { Phone, Clock, Target, Shield, Users, TrendingUp, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wakr</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Wake Up Successfully
            </span>
            <br />
            <span className="text-foreground">Every Single Day</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            Personalized AI wake-up calls and intelligent habit tracking. 
            Start every day with motivation and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto min-w-[180px]">
                <Clock className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Wakr?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4">
            Modern technology meets proven productivity methods
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Smart Wake Calls</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                AI-powered personalized messages with weather updates, calendar events, and daily motivation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-lg">GitHub-Style Habits</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Visualize your progress with the popular commit-grid design that developers love
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Goal Achievement</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Track your habits, build streaks, and achieve your personal goals with gamified progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <CardTitle className="text-lg">Privacy First</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                End-to-end encryption, data export, and complete deletion on request - GDPR compliant
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle className="text-lg">Smart Integration</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Connect with your calendar, weather services, and productivity tools seamlessly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-indigo-500" />
              </div>
              <CardTitle className="text-lg">Global Reach</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Local phone numbers worldwide for cost-effective wake-up calls wherever you are
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground">Transparent and fair - no hidden costs</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Free Trial</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <CardDescription>24 hours free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">1 wake call setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Up to 3 habits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Basic habit tracking</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-lg scale-105 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Basic</CardTitle>
              <div className="text-3xl font-bold">$12.99<span className="text-sm font-normal">/month</span></div>
              <CardDescription>For daily use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Daily wake calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">10 habits tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Mobile notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Progress analytics</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Pro</CardTitle>
              <div className="text-3xl font-bold">$24.99<span className="text-sm font-normal">/month</span></div>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Everything in Basic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">AI personalization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Weather integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Unlimited habits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Calendar sync</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready for Better Mornings?</h2>
          <p className="text-muted-foreground mb-8">
            Start your free 24-hour trial today and transform your daily routine
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Phone className="w-4 h-4 mr-2" />
              Start Free Trial Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold">Wakr</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart wake-up calls for a productive start to your day.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/imprint" className="hover:text-foreground transition-colors">Imprint</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Wakr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}