import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const completeHabitSchema = z.object({
  notes: z.string().optional(),
  mood: z.number().min(1).max(5).optional(),
  energyLevel: z.number().min(1).max(5).optional(),
});

const uncompleteHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = completeHabitSchema.parse(body);

    // Check if habit exists and belongs to user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingCompletion } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', id)
      .eq('user_id', user.id)
      .eq('completed_at', today)
      .maybeSingle();

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Habit already completed today' },
        { status: 400 }
      );
    }

    // Record completion
    const { data: completion, error: completionError } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: id,
        user_id: user.id,
        notes: validatedData.notes,
        mood: validatedData.mood,
        energy_level: validatedData.energyLevel,
        completed_at: today,
      })
      .select()
      .single();

    if (completionError) {
      throw new Error('Failed to record completion');
    }

    // Update habit statistics
    const { data: updatedHabit, error: updateError } = await supabase
      .from('habits')
      .update({
        total_completions: (habit.total_completions || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error('Failed to update habit');
    }

    return NextResponse.json({
      completion,
      habit: updatedHabit,
      message: 'Habit completed successfully!'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error completing habit:', error);
    return NextResponse.json(
      { error: 'Failed to complete habit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date } = uncompleteHabitSchema.parse(body);
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Check if habit exists and belongs to user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Find completion for the specified date
    const { data: completion } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', id)
      .eq('user_id', user.id)
      .eq('completed_at', targetDate)
      .maybeSingle();

    if (!completion) {
      return NextResponse.json(
        { error: 'No completion found for this date' },
        { status: 404 }
      );
    }

    // Remove completion
    const { error: deleteError } = await supabase
      .from('habit_completions')
      .delete()
      .eq('id', completion.id);

    if (deleteError) {
      throw new Error('Failed to delete completion');
    }

    // Update habit statistics
    const { error: updateError } = await supabase
      .from('habits')
      .update({
        total_completions: Math.max((habit.total_completions || 0) - 1, 0),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new Error('Failed to update habit');
    }

    return NextResponse.json({
      message: 'Habit completion removed successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error uncompleting habit:', error);
    return NextResponse.json(
      { error: 'Failed to uncomplete habit' },
      { status: 500 }
    );
  }
}