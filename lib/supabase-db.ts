import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Create a Supabase client for server-side database operations with user context
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// Create a Supabase client for database operations with service role
export function createSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Helper functions for common database operations
export const db = {
  // Users
  users: {
    async findById(id: string, useServiceRole = false) {
      const supabase = useServiceRole ? createSupabaseServiceClient() : await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByEmail(email: string, useServiceRole = false) {
      const supabase = useServiceRole ? createSupabaseServiceClient() : await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data;
    },

    async update(id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async create(user: Database['public']['Tables']['users']['Insert']) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Wake Calls
  wakeCalls: {
    async findByUserId(userId: string) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('wake_calls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async create(wakeCall: Database['public']['Tables']['wake_calls']['Insert']) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('wake_calls')
        .insert(wakeCall)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Database['public']['Tables']['wake_calls']['Update']>) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('wake_calls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from('wake_calls')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Habits
  habits: {
    async findByUserId(userId: string) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('habits')
        .select('*, habit_completions(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async create(habit: Database['public']['Tables']['habits']['Insert']) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('habits')
        .insert(habit)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Database['public']['Tables']['habits']['Update']>) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Habit Completions
  habitCompletions: {
    async create(completion: Database['public']['Tables']['habit_completions']['Insert']) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('habit_completions')
        .insert(completion)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByHabitAndDate(habitId: string, userId: string, date: string) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .gte('completed_at', `${date}T00:00:00`)
        .lt('completed_at', `${date}T23:59:59`)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async delete(id: string) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // User Coins
  userCoins: {
    async findByUserId(userId: string) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('user_coins')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async create(coins: Database['public']['Tables']['user_coins']['Insert']) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('user_coins')
        .insert(coins)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(userId: string, updates: Partial<Database['public']['Tables']['user_coins']['Update']>) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('user_coins')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async addCoins(userId: string, amount: number, source: string, description?: string) {
      const supabase = await createSupabaseServerClient();
      
      // Start a transaction
      const { data: currentCoins, error: fetchError } = await supabase
        .from('user_coins')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (!currentCoins) {
        // Create new coin record
        const { data, error } = await supabase
          .from('user_coins')
          .insert({
            user_id: userId,
            current_balance: amount,
            total_earned: amount,
            total_spent: 0
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Log transaction
        await supabase
          .from('coin_transactions')
          .insert({
            user_id: userId,
            amount,
            balance_after: amount,
            transaction_type: 'earned',
            source,
            description
          });
        
        return data;
      } else {
        // Update existing record
        const newBalance = currentCoins.current_balance + amount;
        const { data, error } = await supabase
          .from('user_coins')
          .update({
            current_balance: newBalance,
            total_earned: currentCoins.total_earned + (amount > 0 ? amount : 0),
            total_spent: currentCoins.total_spent + (amount < 0 ? Math.abs(amount) : 0)
          })
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) throw error;
        
        // Log transaction
        await supabase
          .from('coin_transactions')
          .insert({
            user_id: userId,
            amount,
            balance_after: newBalance,
            transaction_type: amount > 0 ? 'earned' : 'spent',
            source,
            description
          });
        
        return data;
      }
    }
  },

  // Coin Transactions
  coinTransactions: {
    async create(transaction: Database['public']['Tables']['coin_transactions']['Insert']) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from('coin_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Billing Events
  billingEvents: {
    async create(event: Database['public']['Tables']['billing_events']['Insert']) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('billing_events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(stripeEventId: string, updates: Partial<Database['public']['Tables']['billing_events']['Update']>) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('billing_events')
        .update(updates)
        .eq('stripe_event_id', stripeEventId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Audio Cache
  audioCache: {
    async findByCacheKey(cacheKey: string) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('audio_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gte('expires_at', new Date().toISOString())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async create(audioCache: Database['public']['Tables']['audio_cache']['Insert']) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('audio_cache')
        .insert(audioCache)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async upsert(audioCache: Database['public']['Tables']['audio_cache']['Insert']) {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('audio_cache')
        .upsert(audioCache, {
          onConflict: 'cache_key'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateUsage(cacheKey: string) {
      const supabase = createSupabaseServiceClient();
      const { error } = await supabase
        .rpc('increment_audio_usage', { cache_key: cacheKey });
      
      if (error) throw error;
    },

    async delete(cacheKey: string) {
      const supabase = createSupabaseServiceClient();
      const { error } = await supabase
        .from('audio_cache')
        .delete()
        .eq('cache_key', cacheKey);
      
      if (error) throw error;
    },

    async getStats() {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('audio_cache')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },

    async cleanup() {
      const supabase = createSupabaseServiceClient();
      const { count, error } = await supabase
        .from('audio_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  }
};