import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Clock, CreditCard, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/register" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to registration
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Your agreement to use Wakr</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-EU', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-8">
          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                By using Wakr, you agree to these Terms of Service. If you disagree with any part of these terms, 
                you may not use our service. These terms apply to all users of the Wakr platform.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Wakr provides AI-powered wake-up call services, habit tracking, and productivity tools through:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Automated phone calls at scheduled times</li>
                <li>Habit tracking and gamification features</li>
                <li>Weather-integrated personalized messages (Pro users)</li>
                <li>Calendar integration and smart reminders</li>
                <li>Analytics and progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">You agree to:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Provide accurate and current information</li>
                <li>Keep your login credentials secure</li>
                <li>Use the service only for personal, non-commercial purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not abuse or misuse the service</li>
              </ul>
              
              <h4 className="font-semibold mt-4">You must not:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Share your account with others</li>
                <li>Use the service for illegal activities</li>
                <li>Attempt to reverse engineer our software</li>
                <li>Interfere with service operation</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Subscription Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Trial</h4>
                  <p className="text-xs text-muted-foreground">24-hour free trial with limited features</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Basic Plan</h4>
                  <p className="text-xs text-muted-foreground">€12.99/month, billed monthly</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Pro Plan</h4>
                  <p className="text-xs text-muted-foreground">€24.99/month, billed monthly</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Billing:</strong> Subscriptions auto-renew monthly unless cancelled.</p>
                <p><strong>Cancellation:</strong> Cancel anytime through your account settings.</p>
                <p><strong>Refunds:</strong> Pro-rated refunds available within 14 days of billing.</p>
                <p><strong>Price Changes:</strong> We'll notify you 30 days before any price changes.</p>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We strive to provide reliable service but cannot guarantee 100% uptime. Service may be temporarily 
                unavailable for maintenance, updates, or due to factors beyond our control.
              </p>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <strong>Important:</strong> While we make every effort to deliver wake-up calls reliably, 
                    you should not rely solely on Wakr for critical wake-up needs (medical appointments, flights, etc.).
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                to understand how we collect, use, and protect your personal information. 
                We are fully GDPR compliant and respect your data rights.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To the maximum extent permitted by law, Wakr shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Missed wake-up calls or appointments</li>
                <li>Loss of income or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Service interruptions</li>
                <li>Third-party service failures</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Our total liability shall not exceed the amount you paid for the service in the 12 months 
                preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>By You:</strong> You may terminate your account at any time through account settings.</p>
                <p><strong>By Us:</strong> We may suspend or terminate accounts for violations of these terms.</p>
                <p><strong>Effect:</strong> Upon termination, your data will be deleted according to our retention policy.</p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These terms are governed by the laws of Germany. Any disputes will be resolved 
                in the courts of Berlin, Germany. If you're an EU consumer, you may also have 
                rights under your local consumer protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Questions about these terms? Contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@wakr.app</p>
                <p><strong>Support:</strong> support@wakr.app</p>
                <p><strong>Address:</strong> Wakr GmbH, Legal Department, Berlin, Germany</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button variant="default">
              Accept & Continue Registration
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline">
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}