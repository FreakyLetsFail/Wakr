-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE wake_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for user_coins
CREATE POLICY "Users can view own coins" ON user_coins
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for coin_transactions
CREATE POLICY "Users can view own transactions" ON coin_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for achievements (public read)
CREATE POLICY "Everyone can view achievements" ON achievements
    FOR SELECT USING (true);

-- Create policies for rewards_catalog (public read)
CREATE POLICY "Everyone can view rewards catalog" ON rewards_catalog
    FOR SELECT USING (true);

-- Create policies for user_rewards
CREATE POLICY "Users can view own rewards" ON user_rewards
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for wake_calls
CREATE POLICY "Users can view own wake calls" ON wake_calls
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wake calls" ON wake_calls
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wake calls" ON wake_calls
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wake calls" ON wake_calls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for call_logs
CREATE POLICY "Users can view own call logs" ON call_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for custom_calls
CREATE POLICY "Users can manage own custom calls" ON custom_calls
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for habits
CREATE POLICY "Users can manage own habits" ON habits
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for habit_completions
CREATE POLICY "Users can view own habit completions" ON habit_completions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_completions.habit_id 
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own habit completions" ON habit_completions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_completions.habit_id 
            AND habits.user_id = auth.uid()
        )
    );

-- Create policies for push_subscriptions
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for analytics_events
CREATE POLICY "Users can insert own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for billing_events
CREATE POLICY "Users can view own billing events" ON billing_events
    FOR SELECT USING (auth.uid() = user_id);

-- Create policies for gdpr_consent_logs
CREATE POLICY "Users can view own consent logs" ON gdpr_consent_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent logs" ON gdpr_consent_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audio cache policies (service role only)
-- No user policies for audio_cache - managed by service

-- Audit logs policies (service role only)
-- No user policies for audit_logs - managed by service

-- Data processing logs policies
CREATE POLICY "Users can view own data processing logs" ON data_processing_logs
    FOR SELECT USING (auth.uid() = user_id);

-- System config policies (admin only)
-- No user policies for system_config - admin only