import { AudioCache } from './AudioCache';
import { TwilioTTS } from './TwilioTTS';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export interface WeatherData {
  temperature: string;
  temperatureMax: string;
  condition: string;
}

export interface WakeupContext {
  dayName: string;
  time: string;
  timeSlot: string; // '06:00', '06:30', etc.
  dayType: 'weekday' | 'weekend';
  todaysHabits: Array<{ name: string; icon: string }>;
  weather?: WeatherData;
}

export interface AudioPart {
  id: string;
  url: string;
  durationMs: number;
  type: string;
  cached: boolean;
}

export interface CompositeAudio {
  url: string;
  duration: number;
  parts: AudioPart[];
  totalCost: number;
}

export class SmartAudioBuilder {
  private audioCache: AudioCache;
  private tts: TwilioTTS;
  
  constructor() {
    this.audioCache = new AudioCache();
    this.tts = new TwilioTTS();
  }

  async buildPersonalizedAudio(
    user: User, 
    context: WakeupContext
  ): Promise<CompositeAudio> {
    const parts: AudioPart[] = [];
    let totalCost = 0;
    
    // 1. Greeting (always cached)
    const greeting = await this.getCachedPart('greeting', {
      name: user.first_name,
      day: context.dayName,
      time: context.time,
      language: user.language || 'en'
    });
    parts.push(greeting);
    if (!greeting.cached) totalCost += 0.0008; // Standard TTS cost
    
    // 2. Weather (Pro only, semi-cached)
    if (user.subscription_tier === 'PRO' && context.weather) {
      const weather = await this.getWeatherPart(context.weather, user.language || 'en');
      parts.push(weather);
      if (!weather.cached) totalCost += 0.0008;
    }
    
    // 3. Habits summary (dynamically generated)
    if (context.todaysHabits.length > 0) {
      const habits = await this.generateHabitsPart(context.todaysHabits, user.language || 'en');
      parts.push(habits);
      totalCost += 0.0008 * Math.ceil(habits.durationMs / 5000); // Cost per 5 seconds
    }
    
    // 4. Motivation (cached variants)
    const motivation = await this.getCachedPart('motivation', {
      variant: this.getMotivationVariant(context),
      language: user.language || 'en'
    });
    parts.push(motivation);
    if (!motivation.cached) totalCost += 0.0008;
    
    // 5. Combine all parts
    const combinedAudio = await this.combineAudioParts(parts);
    
    return {
      ...combinedAudio,
      parts,
      totalCost
    };
  }
  
  private async getCachedPart(
    type: string,
    variables: Record<string, any>
  ): Promise<AudioPart> {
    const cacheKey = this.generateCacheKey(type, variables);
    
    // Check cache first
    const cached = await this.audioCache.get(cacheKey);
    if (cached) {
      return {
        id: cacheKey,
        url: cached.audioUrl,
        durationMs: cached.durationSeconds * 1000,
        type,
        cached: true
      };
    }
    
    // Generate new audio
    const template = await this.getTemplate(type, variables.language);
    const text = this.interpolate(template, variables);
    const audio = await this.tts.generateSpeech(text, variables.language);
    
    // Cache for future use
    await this.audioCache.set(cacheKey, {
      audioUrl: audio.url,
      durationSeconds: Math.ceil(audio.duration / 1000),
      textContent: text,
      language: variables.language,
      audioType: type,
      variant: variables.variant
    }, this.getCacheTTL(type));
    
    return {
      id: cacheKey,
      url: audio.url,
      durationMs: audio.duration,
      type,
      cached: false
    };
  }
  
  private async getWeatherPart(weather: WeatherData, language: string): Promise<AudioPart> {
    // Cache by temperature ranges and conditions
    const tempRange = Math.floor(Number(weather.temperature) / 5) * 5;
    const cacheKey = `weather_${language}_${tempRange}_${weather.condition}`;
    
    const cached = await this.audioCache.get(cacheKey);
    if (cached) {
      return {
        id: cacheKey,
        url: cached.audioUrl,
        durationMs: cached.durationSeconds * 1000,
        type: 'weather',
        cached: true
      };
    }
    
    const template = await this.getWeatherTemplate(weather.condition || 'clear', language);
    const text = this.interpolate(template, {
      temp: Math.round(Number(weather.temperature)),
      tempMax: Math.round(Number(weather.temperatureMax)),
      condition: this.translateCondition(weather.condition || 'clear', language)
    });
    
    const audio = await this.tts.generateSpeech(text, language);
    
    // Cache for 7 days
    await this.audioCache.set(cacheKey, {
      audioUrl: audio.url,
      durationSeconds: Math.ceil(audio.duration / 1000),
      textContent: text,
      language,
      audioType: 'weather',
      variant: weather.condition
    }, '7d');
    
    return {
      id: cacheKey,
      url: audio.url,
      durationMs: audio.duration,
      type: 'weather',
      cached: false
    };
  }
  
  private async generateHabitsPart(habits: Array<{ name: string; icon: string }>, language: string): Promise<AudioPart> {
    const template = await this.getTemplate('habits', language);
    const habitList = habits.map(h => h.name).join(', ');
    const text = this.interpolate(template, {
      count: habits.length,
      list: habitList
    });
    
    const audio = await this.tts.generateSpeech(text, language);
    
    return {
      id: `habits_${Date.now()}`,
      url: audio.url,
      durationMs: audio.duration,
      type: 'habits',
      cached: false
    };
  }
  
  private async getTemplate(type: string, language: string): Promise<string> {
    // Use fallback templates directly since audioMessageParts table doesn't exist yet
    const fallbacks: Record<string, Record<string, string>> = {
        greeting: {
          en: 'Good morning {name}, it\'s {time} on {day}',
          de: 'Guten Morgen {name}, es ist {time} Uhr am {day}',
          es: 'Buenos días {name}, son las {time} del {day}'
        },
        weather: {
          en: 'Today will be {condition} with a high of {tempMax} degrees',
          de: 'Heute wird es {condition} mit maximal {tempMax} Grad',
          es: 'Hoy será {condition} con una máxima de {tempMax} grados'
        },
        habits: {
          en: 'You have {count} habits scheduled: {list}',
          de: '{count} Gewohnheiten stehen an: {list}',
          es: 'Tienes {count} hábitos programados: {list}'
        },
        motivation: {
          en: 'Let\'s make today amazing!',
          de: 'Lass uns heute großartig machen!',
          es: '¡Hagamos que hoy sea increíble!'
        }
      };
      
      return fallbacks[type]?.[language] || fallbacks[type]?.['en'] || '';
  }
  
  private async getWeatherTemplate(condition: string, language: string): Promise<string> {
    const templates: Record<string, Record<string, string>> = {
      en: {
        clear: 'It\'s a beautiful clear day with {tempMax} degrees',
        cloudy: 'Expect cloudy skies with temperatures up to {tempMax}',
        rainy: 'Don\'t forget your umbrella! Rain expected with {tempMax} degrees',
        sunny: 'Sunny weather ahead with a pleasant {tempMax} degrees'
      },
      de: {
        clear: 'Ein schöner klarer Tag mit {tempMax} Grad',
        cloudy: 'Bewölkt mit Temperaturen bis {tempMax} Grad',
        rainy: 'Regenschirm nicht vergessen! Regen bei {tempMax} Grad',
        sunny: 'Sonniges Wetter mit angenehmen {tempMax} Grad'
      }
    };
    
    return templates[language]?.[condition] || templates[language]?.['clear'] || templates['en']['clear'];
  }
  
  private interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }
  
  private generateCacheKey(type: string, variables: Record<string, any>): string {
    const parts = [type, variables.language];
    
    if (variables.variant) parts.push(variables.variant);
    if (variables.time) parts.push(variables.time.replace(':', ''));
    if (variables.dayType) parts.push(variables.dayType);
    
    return parts.join('_');
  }
  
  private getMotivationVariant(context: WakeupContext): string {
    // Smart variant selection based on context
    if (context.dayType === 'weekend') return 'weekend';
    if (context.dayName === 'Monday') return 'monday';
    if (context.dayName === 'Friday') return 'friday';
    if (parseInt(context.time) < 6) return 'early';
    if (parseInt(context.time) > 8) return 'late';
    return 'standard';
  }
  
  private getCacheTTL(type: string): string {
    const ttls: Record<string, string> = {
      greeting: '30d',
      weather: '7d',
      motivation: '30d',
      habits: '1d'
    };
    return ttls[type] || '7d';
  }
  
  private translateCondition(condition: string, language: string): string {
    const translations: Record<string, Record<string, string>> = {
      en: {
        clear: 'clear',
        cloudy: 'cloudy',
        rainy: 'rainy',
        sunny: 'sunny',
        partly_cloudy: 'partly cloudy'
      },
      de: {
        clear: 'klar',
        cloudy: 'bewölkt',
        rainy: 'regnerisch',
        sunny: 'sonnig',
        partly_cloudy: 'teilweise bewölkt'
      },
      es: {
        clear: 'despejado',
        cloudy: 'nublado',
        rainy: 'lluvioso',
        sunny: 'soleado',
        partly_cloudy: 'parcialmente nublado'
      }
    };
    
    return translations[language]?.[condition] || condition;
  }
  
  private async combineAudioParts(parts: AudioPart[]): Promise<CompositeAudio> {
    // In production, this would use an audio processing service
    // For now, we'll create a TwiML that plays parts sequentially
    const combinedUrl = await this.tts.createCombinedTwiML(parts.map(p => p.url));
    const totalDuration = parts.reduce((sum, part) => sum + part.durationMs, 0);
    
    return {
      url: combinedUrl,
      duration: totalDuration,
      parts,
      totalCost: 0 // Calculated in buildPersonalizedAudio
    };
  }
}