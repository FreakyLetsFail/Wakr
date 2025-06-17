import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/supabase-db';
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
  { params }: { params: { id: string } }
) {
  try {
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
      .eq('id', params.id)
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    const existingCompletion = await db.habitCompletions.findByHabitAndDate(
      params.id,
      user.id,
      today
    );

    if (existingCompletion) {
      return NextResponse.json(
        { error: 'Habit already completed today' },
        { status: 400 }
      );
    }

    // Record completion
    const completion = await db.habitCompletions.create({
      habit_id: params.id,
      user_id: user.id,
      notes: validatedData.notes,
      mood: validatedData.mood,
      energy_level: validatedData.energyLevel,
    });

    // Update habit statistics
    const { data: updatedHabit, error: updateError } = await supabase
      .from('habits')
      .update({
        total_completions: (habit.total_completions || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      throw new Error('Failed to update habit');
    }

    // Award coins for habit completion
    const coinsAwarded = 10; // Base reward for habit completion
    
    // Get current coins and update with XP
    let userCoinsRecord = await db.userCoins.findByUserId(user.id);
    
    if (!userCoinsRecord) {
      // Create user coins record if it doesn't exist
      userCoinsRecord = await db.userCoins.create({
        user_id: user.id,
        current_balance: coinsAwarded,
        total_earned: coinsAwarded,
        total_spent: 0,
        xp: 5,
      });
    } else {
      // Update existing record
      const newBalance = userCoinsRecord.current_balance + coinsAwarded;
      const newXp = (userCoinsRecord.xp || 0) + 5;
      
      userCoinsRecord = await db.userCoins.update(user.id, {
        current_balance: newBalance,
        total_earned: userCoinsRecord.total_earned + coinsAwarded,
        xp: newXp,
        updated_at: new Date().toISOString(),
      });
    }

    // Log coin transaction
    await db.coinTransactions.create({
      user_id: user.id,
      amount: coinsAwarded,
      balance_after: userCoinsRecord.current_balance,
      transaction_type: 'earned',
      source: 'habit_complete',
      source_id: params.id,
      description: `Completed habit: ${habit.name}`,
      metadata: {
        habitId: params.id,
        habitName: habit.name,
        completionId: completion.id,
      },
    });

    return NextResponse.json({
      completion,
      habit: updatedHabit,
      coinsAwarded,
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
  { params }: { params: { id: string } }
) {
  try {
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
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Find completion for the specified date
    const completion = await db.habitCompletions.findByHabitAndDate(
      params.id,
      user.id,
      targetDate
    );

    if (!completion) {
      return NextResponse.json(
        { error: 'No completion found for this date' },
        { status: 404 }
      );
    }

    // Remove completion
    await db.habitCompletions.delete(completion.id);

    // Update habit statistics
    const { error: updateError } = await supabase
      .from('habits')
      .update({
        total_completions: Math.max((habit.total_completions || 0) - 1, 0),
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (updateError) {
      throw new Error('Failed to update habit');
    }

    // Reverse coin transaction
    const coinsDeducted = 10;
    
    // Get current coins and update
    const userCoinsRecord = await db.userCoins.findByUserId(user.id);
    
    if (userCoinsRecord) {
      const newBalance = Math.max(userCoinsRecord.current_balance - coinsDeducted, 0);
      const newXp = Math.max((userCoinsRecord.xp || 0) - 5, 0);
      
      const updatedCoins = await db.userCoins.update(user.id, {
        current_balance: newBalance,
        total_earned: Math.max(userCoinsRecord.total_earned - coinsDeducted, 0),
        xp: newXp,
        updated_at: new Date().toISOString(),
      });

      // Log reverse coin transaction
      await db.coinTransactions.create({
        user_id: user.id,
        amount: -coinsDeducted,
        balance_after: updatedCoins.current_balance,
        transaction_type: 'spent',
        source: 'habit_uncomplete',
        source_id: params.id,
        description: `Uncompleted habit: ${habit.name}`,
        metadata: {
          habitId: params.id,
          habitName: habit.name,
          originalCompletionId: completion.id,
          date: targetDate,
        },
      });
    }

    return NextResponse.json({
      message: 'Habit completion removed successfully',
      coinsDeducted
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