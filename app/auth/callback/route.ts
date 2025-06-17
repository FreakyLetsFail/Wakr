import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('redirect_to') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if this is a new user completing email verification
      const tempData = data.user.user_metadata?.temp_registration_data;
      
      if (tempData && !data.user.user_metadata?.onboarding_completed) {
        // Transfer temporary registration data to permanent metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            ...tempData,
            temp_registration_data: null, // Clear temp data
            onboarding_completed: true,
            email_verified_at: new Date().toISOString(),
          },
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}