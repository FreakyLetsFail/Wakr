import { db } from '@/lib/supabase-db';
import Redis from 'ioredis';

export interface CachedAudio {
  audioUrl: string;
  durationSeconds: number;
  textContent?: string;
  language: string;
  audioType: string;
  variant?: string;
}

export class AudioCache {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  
  async get(cacheKey: string): Promise<CachedAudio | null> {
    // Try Redis first
    const redisData = await this.redis.get(`audio:${cacheKey}`);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      // Update usage count in background
      this.updateUsageCount(cacheKey);
      return parsed;
    }
    
    // Fall back to database
    const dbEntry = await db.audioCache.findByCacheKey(cacheKey);
    
    if (dbEntry) {
      const cachedData: CachedAudio = {
        audioUrl: dbEntry.audio_url,
        durationSeconds: dbEntry.duration_seconds || 0,
        textContent: dbEntry.text_content || undefined,
        language: dbEntry.language,
        audioType: dbEntry.audio_type,
        variant: dbEntry.variant || undefined
      };
      
      // Cache in Redis for faster access
      await this.redis.setex(
        `audio:${cacheKey}`,
        3600, // 1 hour TTL
        JSON.stringify(cachedData)
      );
      
      // Update usage count
      await this.updateUsageCount(cacheKey);
      
      return cachedData;
    }
    
    return null;
  }
  
  async set(
    cacheKey: string, 
    data: CachedAudio, 
    ttl: string = '7d'
  ): Promise<void> {
    const expiresAt = this.parseTTL(ttl);
    
    // Store in database
    await db.audioCache.upsert({
      cache_key: cacheKey,
      language: data.language,
      audio_type: data.audioType,
      time: this.extractTime(cacheKey),
      variant: data.variant,
      audio_url: data.audioUrl,
      duration_seconds: data.durationSeconds,
      text_content: data.textContent,
      usage_count: 0,
      expires_at: expiresAt.toISOString()
    });
    
    // Cache in Redis
    const redisTTL = this.ttlToSeconds(ttl);
    await this.redis.setex(
      `audio:${cacheKey}`,
      redisTTL,
      JSON.stringify(data)
    );
  }
  
  async invalidate(cacheKey: string): Promise<void> {
    // Remove from Redis
    await this.redis.del(`audio:${cacheKey}`);
    
    // Remove from database
    await db.audioCache.delete(cacheKey);
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    // Remove from Redis
    const keys = await this.redis.keys(`audio:${pattern}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    
    // Pattern matching in database would require LIKE query
    // For now, we'll just clear Redis and let DB entries expire
  }
  
  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    topUsed: Array<{ key: string; count: number }>;
    costSavings: number;
  }> {
    const entries = await db.audioCache.getStats();
    
    const totalEntries = entries?.length || 0;
    const totalSize = entries?.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) || 0;
    const topUsed = entries?.map(e => ({
      key: e.cache_key,
      count: e.usage_count || 0
    })) || [];
    
    // Calculate cost savings (cached uses * TTS cost per use)
    const costSavings = entries?.reduce((sum, e) => {
      const uses = Math.max(0, (e.usage_count || 0) - 1); // First use doesn't save
      return sum + (uses * 0.0008); // $0.0008 per TTS generation
    }, 0) || 0;
    
    return {
      totalEntries,
      totalSize,
      topUsed,
      costSavings
    };
  }
  
  private async updateUsageCount(cacheKey: string): Promise<void> {
    await db.audioCache.updateUsage(cacheKey);
  }
  
  private extractTime(cacheKey: string): string | null {
    // Extract time from cache keys like "en_wakeup_0730_standard"
    const match = cacheKey.match(/_(\d{4})_/);
    if (match) {
      const time = match[1];
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return null;
  }
  
  private parseTTL(ttl: string): Date {
    const now = new Date();
    const match = ttl.match(/^(\d+)([hdm])$/);
    
    if (!match) {
      throw new Error(`Invalid TTL format: ${ttl}`);
    }
    
    const [, value, unit] = match;
    const amount = parseInt(value);
    
    switch (unit) {
      case 'h':
        now.setHours(now.getHours() + amount);
        break;
      case 'd':
        now.setDate(now.getDate() + amount);
        break;
      case 'm':
        now.setMonth(now.getMonth() + amount);
        break;
    }
    
    return now;
  }
  
  private ttlToSeconds(ttl: string): number {
    const match = ttl.match(/^(\d+)([hdm])$/);
    if (!match) return 3600; // Default 1 hour
    
    const [, value, unit] = match;
    const amount = parseInt(value);
    
    switch (unit) {
      case 'h':
        return amount * 3600;
      case 'd':
        return amount * 86400;
      case 'm':
        return amount * 2592000; // 30 days
      default:
        return 3600;
    }
  }
  
  async cleanup(): Promise<number> {
    // Clean up expired entries
    return await db.audioCache.cleanup();
  }
}