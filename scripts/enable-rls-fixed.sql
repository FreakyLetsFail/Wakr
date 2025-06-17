-- Enable Row Level Security on all existing tables
-- (Skip tables that don't exist in your schema)

-- Tables that already have RLS enabled (from your schema):
-- users, habits, habit_completions, wake_calls, user_coins

-- Enable RLS on remaining tables
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for remaining tables

-- Coin transactions policies
CREATE POLICY "Users can view own coin transactions" ON coin_transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- User achievements policies  
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Achievements policies (public read)
CREATE POLICY "Everyone can view achievements catalog" ON achievements
    FOR SELECT USING (true);

-- Rewards catalog policies (public read)
CREATE POLICY "Everyone can view rewards catalog" ON rewards_catalog
    FOR SELECT USING (true);

-- User rewards policies
CREATE POLICY "Users can view own rewards" ON user_rewards
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Call logs policies
CREATE POLICY "Users can view own call logs" ON call_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Custom calls policies
CREATE POLICY "Users can manage own custom calls" ON custom_calls
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Push subscriptions policies
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Analytics events policies
CREATE POLICY "Users can insert own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Billing events policies
CREATE POLICY "Users can view own billing events" ON billing_events
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Data processing logs policies
CREATE POLICY "Users can view own data processing logs" ON data_processing_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Audio cache - no user policies (service role only)
-- Audit logs - no user policies (admin only)
-- System config - no user policies (admin only)