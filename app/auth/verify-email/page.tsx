import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/register" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Registrierung
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">E-Mail bestätigen</CardTitle>
            <CardDescription>
              Wir haben dir einen Bestätigungslink an deine E-Mail-Adresse gesendet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
              <div className="space-y-2">
                <p><strong>Nächste Schritte:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Überprüfe dein E-Mail-Postfach</li>
                  <li>Klicke auf den Bestätigungslink in der E-Mail</li>
                  <li>Du wirst automatisch eingeloggt und kannst loslegen</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>E-Mail nicht erhalten?</strong> Überprüfe auch deinen Spam-Ordner. 
                  Der Link ist 24 Stunden gültig.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/login">
                  Zur Anmeldung
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Zur Startseite
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}