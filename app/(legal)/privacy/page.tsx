import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, Download, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">How we protect and handle your data</p>
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

        {/* GDPR Compliance Notice */}
        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Shield className="w-5 h-5" />
              GDPR Compliant
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Wakr is fully compliant with the European General Data Protection Regulation (GDPR) and respects your privacy rights.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                What Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Name and email address (for account creation)</li>
                  <li>Phone number (for wake-up calls, encrypted at rest)</li>
                  <li>Location/timezone (for accurate scheduling)</li>
                  <li>City (Pro users only, for weather integration)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Wake call success/failure rates</li>
                  <li>Habit completion tracking</li>
                  <li>App usage patterns (anonymized)</li>
                  <li>Device information (for compatibility)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <strong>Service Delivery:</strong> To provide wake-up calls, habit tracking, and app functionality
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <strong>Communication:</strong> To send important service updates and notifications
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <strong>Improvement:</strong> To analyze usage patterns and improve our service (anonymized data only)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>End-to-end encryption for sensitive data (phone numbers, personal information)</li>
                <li>Secure data transmission using TLS/SSL</li>
                <li>Regular security audits and updates</li>
                <li>Limited data retention periods</li>
                <li>Access controls and staff training</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Your Rights Under GDPR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                As an EU resident, you have the following rights regarding your personal data:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Access & Portability</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    <li>Request a copy of your data</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Control & Deletion</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Processing Control</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    <li>Restrict data processing</li>
                    <li>Object to certain uses</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Consent Management</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                    <li>Withdraw consent anytime</li>
                    <li>Manage marketing preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use the following trusted third-party services to provide our functionality:
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Twilio:</strong> For voice calls and SMS. Data is processed securely and only for service delivery.
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Stripe:</strong> For payment processing. We do not store payment card information.
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <strong>Weather APIs:</strong> Anonymous location data for Pro users only.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For any privacy-related questions or to exercise your rights, contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@wakr.app</p>
                <p><strong>Data Protection Officer:</strong> dpo@wakr.app</p>
                <p><strong>Address:</strong> Wakr GmbH, Privacy Team, Berlin, Germany</p>
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
          <Link href="/terms">
            <Button variant="outline">
              View Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}