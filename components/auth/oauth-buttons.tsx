'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaApple, FaMicrosoft } from 'react-icons/fa';
import { createClient } from '@/lib/supabase-client';

interface OAuthButtonsProps {
  redirectTo?: string;
  className?: string;
}

type Provider = 'google' | 'github' | 'apple' | 'azure';

export function OAuthButtons({ redirectTo = '/dashboard', className }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const supabase = createClient();

  const handleOAuthLogin = async (provider: Provider) => {
    try {
      setLoading(provider);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        // Handle error (show toast, etc.)
      }
      // If successful, the user will be redirected automatically
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
    } finally {
      setLoading(null);
    }
  };

  const providers = [
    {
      id: 'google' as Provider,
      name: 'Google',
      icon: FaGoogle,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'github' as Provider,
      name: 'GitHub',
      icon: FaGithub,
      color: 'bg-gray-800 hover:bg-gray-900',
    },
    {
      id: 'azure' as Provider,
      name: 'Microsoft',
      icon: FaMicrosoft,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {providers.map((provider) => {
        const Icon = provider.icon;
        const isLoading = loading === provider.id;
        
        return (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className={`w-full ${provider.color} text-white border-0`}
            onClick={() => handleOAuthLogin(provider.id)}
            disabled={!!loading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Icon className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Connecting...' : `Continue with ${provider.name}`}
          </Button>
        );
      })}
    </div>
  );
}