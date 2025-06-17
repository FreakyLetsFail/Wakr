'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Cookie, Settings } from 'lucide-react';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already provided consent
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (state: ConsentState) => {
    const consentData = {
      ...state,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    document.cookie = `cookie-consent=${JSON.stringify(consentData)}; path=/; max-age=31536000; SameSite=Strict`;
    
    // Initialize analytics if consented
    if (state.analytics) {
      // TODO: Initialize analytics (Plausible, etc.)
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('consent-granted');
      }
    }
    
    setIsVisible(false);
  };

  const acceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(fullConsent);
    saveConsent(fullConsent);
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const rejectAll = () => {
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    saveConsent(minimalConsent);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="max-w-5xl mx-auto p-6 shadow-2xl bg-background border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">Cookie-Einstellungen</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">
          Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unseren Service zu optimieren. 
          Sie können Ihre Präferenzen unten anpassen. Weitere Informationen finden Sie in unserer{' '}
          <a href="/datenschutz" className="text-primary hover:underline">
            Datenschutzerklärung
          </a>.
        </p>

        {showDetails && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="font-medium">Notwendige Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Erforderlich für die Grundfunktionen der Website. Diese können nicht deaktiviert werden.
                </p>
              </div>
              <Switch checked disabled />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="font-medium">Analyse-Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Helfen uns zu verstehen, wie Sie die App nutzen. Anonyme Statistiken zur Verbesserung.
                </p>
              </div>
              <Switch
                checked={consent.analytics}
                onCheckedChange={(checked) => 
                  setConsent({ ...consent, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="font-medium">Marketing-Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Für personalisierte Angebote und Newsletter. Helfen uns, relevante Inhalte zu zeigen.
                </p>
              </div>
              <Switch
                checked={consent.marketing}
                onCheckedChange={(checked) => 
                  setConsent({ ...consent, marketing: checked })
                }
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={acceptAll}
            className="flex-1"
          >
            Alle akzeptieren
          </Button>
          
          {showDetails ? (
            <Button
              variant="outline"
              onClick={acceptSelected}
              className="flex-1"
            >
              Auswahl speichern
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowDetails(true)}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={rejectAll}
            className="flex-1"
          >
            Nur notwendige
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <a href="/datenschutz" className="hover:underline">
            Datenschutzerklärung
          </a>
          <a href="/impressum" className="hover:underline">
            Impressum
          </a>
          <a href="/cookies" className="hover:underline">
            Cookie-Richtlinie
          </a>
          <a href="/agb" className="hover:underline">
            AGB
          </a>
        </div>
      </Card>
    </div>
  );
}