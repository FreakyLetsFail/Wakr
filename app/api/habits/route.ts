import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/supabase-db';
import { z } from 'zod';

// Validation schemas
const createHabitSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  icon: z.string().max(50).default('📌'),
  color: z.string().max(7).default('#7c3aed'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']).default('DAILY'),
  frequencyConfig: z.object({}).optional(),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().optional(),
  reminderMessage: z.string().optional(),
});

const updateHabitSchema = createHabitSchema.partial();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userHabits = await db.habits.findByUserId(user.id);

    return NextResponse.json({ habits: userHabits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createHabitSchema.parse(body);

    const newHabit = await db.habits.create({
      user_id: user.id,
      name: validatedData.name,
      description: validatedData.description,
      icon: validatedData.icon,
      color: validatedData.color,
      frequency: validatedData.frequency,
      frequency_config: validatedData.frequencyConfig || {},
      start_date: new Date().toISOString().split('T')[0],
      reminder_enabled: validatedData.reminderEnabled,
      reminder_time: validatedData.reminderTime,
      reminder_message: validatedData.reminderMessage,
    });

    return NextResponse.json({ habit: newHabit }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating habit:', error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}