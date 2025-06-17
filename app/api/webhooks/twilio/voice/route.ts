import { NextRequest, NextResponse } from 'next/server';
import { TwiMLGenerator, validateTwilioSignature } from '@/lib/twilio';
import { createSupabaseServiceClient } from '@/lib/supabase-db';
import { PushNotificationService } from '@/lib/push';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    const callSid = body.CallSid as string;
    const from = body.From as string;
    const to = body.To as string;
    const callStatus = body.CallStatus as string;
    
    // Verify webhook signature for security
    const signature = request.headers.get('X-Twilio-Signature');
    const url = `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice`;
    
    if (!validateTwilioSignature(
      process.env.TWILIO_AUTH_TOKEN!,
      signature!,
      url,
      body as Record<string, any>
    )) {
      console.error('Invalid Twilio signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find user by phone number (encrypted comparison will be needed in production)
    const supabase = createSupabaseServiceClient();
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*, wake_calls(*), push_subscriptions(*)')
      .eq('phone', to)
      .single();

    if (userError || !user) {
      console.error('User not found for phone:', to);
      const errorTwiML = TwiMLGenerator.generateErrorResponse();
      return new NextResponse(errorTwiML, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    const wakeCall = user.wake_calls?.[0]; // Get first wake call config
    
    // Log the call
    const { error: logError } = await supabase
      .from('call_logs')
      .insert({
        user_id: user.id,
        wake_call_id: wakeCall?.id,
        scheduled_time: new Date().toISOString(),
        initiated_at: new Date().toISOString(),
        status: 'IN_PROGRESS',
        twilio_call_sid: callSid,
        challenge_presented: wakeCall?.challenge_type !== 'none'
      });

    if (logError) {
      console.error('Error logging call:', logError);
    }

    // Generate appropriate TwiML response
    let twimlResponse: string;
    
    if (wakeCall?.challenge_type === 'none') {
      // Simple wake-up call without challenge
      twimlResponse = TwiMLGenerator.generateWakeUpResponse(
        user.first_name,
        user.language as any,
        wakeCall.custom_message || undefined
      );
    } else {
      // Wake-up call with app-based challenge
      twimlResponse = TwiMLGenerator.generateWakeUpResponse(
        user.first_name,
        user.language as any,
        wakeCall?.custom_message || undefined
      );

      // Send push notification for challenge after call ends
      if (user.push_subscriptions && user.push_subscriptions.length > 0) {
        setTimeout(async () => {
          await PushNotificationService.sendWakeUpChallenge(
            user.push_subscriptions.map(sub => ({
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            })),
            user.first_name,
            wakeCall?.challenge_type || 'math'
          );
        }, 10000); // Wait 10 seconds after call starts
      }
    }

    return new NextResponse(twimlResponse, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Error handling Twilio voice webhook:', error);
    
    const errorTwiML = TwiMLGenerator.generateErrorResponse();
    return new NextResponse(errorTwiML, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}

// Handle test calls with verification codes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      const errorTwiML = TwiMLGenerator.generateErrorResponse();
      return new NextResponse(errorTwiML, {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    const testTwiML = TwiMLGenerator.generateTestCallResponse(code);
    
    return new NextResponse(testTwiML, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Error handling test call:', error);
    
    const errorTwiML = TwiMLGenerator.generateErrorResponse();
    return new NextResponse(errorTwiML, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
}