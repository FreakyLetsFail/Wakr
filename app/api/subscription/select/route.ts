import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/supabase-db';
import { z } from 'zod';

const selectPlanSchema = z.object({
  plan: z.enum(['trial', 'basic', 'pro']),
  city: z.object({
    name: z.string(),
    country: z.string(), 
    latitude: z.number(),
    longitude: z.number(),
    timezone: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // For now, allow subscription selection without authentication (mock mode)
    if (!session?.user?.email) {
      console.log('No session found, proceeding in mock mode for subscription selection');
    }

    const body = await request.json();
    const validatedData = selectPlanSchema.parse(body);

    // For Pro plan, city is required
    if (validatedData.plan === 'pro' && !validatedData.city) {
      return NextResponse.json(
        { error: 'City selection is required for Pro plan' },
        { status: 400 }
      );
    }

    // Update user subscription tier
    const subscriptionTier = validatedData.plan.toUpperCase() as 'TRIAL' | 'BASIC' | 'PRO';
    
    const updateData: any = {
      subscriptionTier,
      subscriptionStatus: 'active',
    };

    // Set trial end date for trial plan
    if (validatedData.plan === 'trial') {
      const trialEnd = new Date();
      trialEnd.setHours(trialEnd.getHours() + 24);
      updateData.trialEndsAt = trialEnd;
    }

    // Add city information for Pro plan
    if (validatedData.plan === 'pro' && validatedData.city) {
      updateData.hometown = validatedData.city.name;
      updateData.timezone = validatedData.city.timezone || 'Europe/Berlin';
      updateData.preferences = {
        wake_time: "07:00",
        notification_sound: true,
        vibration: true,
        theme: "system",
        wake_challenge: "math",
        snooze_limit: 3,
        habit_reminder_time: "20:00",
        weather_enabled: true,
        weather_location: {
          name: validatedData.city.name,
          country: validatedData.city.country,
          latitude: validatedData.city.latitude,
          longitude: validatedData.city.longitude,
          timezone: validatedData.city.timezone || 'Europe/Berlin',
        }
      };
    }

    // Update user subscription if session exists
    if (session?.user?.email) {
      try {
        const user = await db.users.findByEmail(session.user.email);
        if (user) {
          await db.users.update(user.id, {
            subscription_tier: subscriptionTier,
            subscription_status: 'active',
            trial_ends_at: updateData.trialEndsAt?.toISOString(),
            hometown: updateData.hometown,
            timezone: updateData.timezone,
            preferences: updateData.preferences,
          });
        }
      } catch (dbError) {
        console.log('Database update failed, proceeding in mock mode:', dbError);
      }
    }

    // TODO: For paid plans (basic/pro), integrate with Stripe to create subscription
    // For now, we'll just set the tier without payment

    return NextResponse.json({
      message: 'Plan selected successfully',
      plan: validatedData.plan,
      city: validatedData.city,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error selecting plan:', error);
    return NextResponse.json(
      { error: 'Failed to select plan' },
      { status: 500 }
    );
  }
}