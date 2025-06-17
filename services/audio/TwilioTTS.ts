import twilio from 'twilio';

export interface TTSResult {
  url: string;
  duration: number;
  cost: number;
}

export interface Voice {
  name: string;
  language: string;
  gender: 'male' | 'female';
  tier: 'standard' | 'neural' | 'generative';
}

export class TwilioTTS {
  private client: twilio.Twilio;
  private baseUrl: string;
  
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    this.baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  }
  
  async generateSpeech(
    text: string, 
    language: string = 'en',
    voice?: string
  ): Promise<TTSResult> {
    const selectedVoice = voice || this.selectVoice(language);
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return {
        url: `${this.baseUrl}/api/mock-audio/${encodeURIComponent(text)}`,
        duration: text.length * 60, // Approximate 60ms per character
        cost: this.calculateCost(text, 'standard')
      };
    }
    
    // In production, this would generate actual TTS through Twilio
    // For now, we'll create a TwiML URL that will generate speech on demand
    const twimlUrl = await this.createTwiMLUrl(text, selectedVoice, language);
    
    return {
      url: twimlUrl,
      duration: this.estimateDuration(text),
      cost: this.calculateCost(text, this.getVoiceTier(selectedVoice))
    };
  }
  
  async createCombinedTwiML(audioUrls: string[]): Promise<string> {
    // Create a TwiML that plays multiple audio files
    const twiml = new twilio.twiml.VoiceResponse();
    
    audioUrls.forEach(url => {
      twiml.play(url);
      twiml.pause({ length: 1 }); // 1 second pause between parts
    });
    
    // In production, this would be stored and return a URL
    // For now, return a mock URL
    return `${this.baseUrl}/api/twiml/combined/${Date.now()}`;
  }
  
  private async createTwiMLUrl(text: string, voice: string, language: string): Promise<string> {
    // In production, this would create and store TwiML
    // For now, return a URL that would generate TwiML on demand
    const params = new URLSearchParams({
      text,
      voice,
      language
    });
    
    return `${this.baseUrl}/api/twiml/say?${params.toString()}`;
  }
  
  private selectVoice(language: string): string {
    const voices: Record<string, Voice[]> = {
      en: [
        { name: 'Google.en-US-Neural2-A', language: 'en-US', gender: 'female', tier: 'neural' },
        { name: 'Google.en-US-Neural2-D', language: 'en-US', gender: 'male', tier: 'neural' },
        { name: 'Polly.Matthew', language: 'en-US', gender: 'male', tier: 'standard' },
        { name: 'Polly.Joanna', language: 'en-US', gender: 'female', tier: 'standard' }
      ],
      de: [
        { name: 'Google.de-DE-Neural2-B', language: 'de-DE', gender: 'male', tier: 'neural' },
        { name: 'Google.de-DE-Neural2-C', language: 'de-DE', gender: 'female', tier: 'neural' },
        { name: 'Polly.Hans', language: 'de-DE', gender: 'male', tier: 'standard' },
        { name: 'Polly.Marlene', language: 'de-DE', gender: 'female', tier: 'standard' }
      ],
      es: [
        { name: 'Google.es-ES-Neural2-A', language: 'es-ES', gender: 'female', tier: 'neural' },
        { name: 'Google.es-ES-Neural2-B', language: 'es-ES', gender: 'male', tier: 'neural' },
        { name: 'Polly.Conchita', language: 'es-ES', gender: 'female', tier: 'standard' },
        { name: 'Polly.Enrique', language: 'es-ES', gender: 'male', tier: 'standard' }
      ],
      fr: [
        { name: 'Google.fr-FR-Neural2-A', language: 'fr-FR', gender: 'female', tier: 'neural' },
        { name: 'Google.fr-FR-Neural2-B', language: 'fr-FR', gender: 'male', tier: 'neural' },
        { name: 'Polly.Celine', language: 'fr-FR', gender: 'female', tier: 'standard' },
        { name: 'Polly.Mathieu', language: 'fr-FR', gender: 'male', tier: 'standard' }
      ]
    };
    
    const languageVoices = voices[language] || voices.en;
    // Prefer neural voices for better quality
    const neuralVoices = languageVoices.filter(v => v.tier === 'neural');
    
    if (neuralVoices.length > 0) {
      return neuralVoices[0].name;
    }
    
    return languageVoices[0].name;
  }
  
  private getVoiceTier(voiceName: string): 'standard' | 'neural' | 'generative' {
    if (voiceName.includes('Neural')) return 'neural';
    if (voiceName.includes('Chirp')) return 'generative';
    return 'standard';
  }
  
  private calculateCost(text: string, tier: 'standard' | 'neural' | 'generative'): number {
    const charCount = text.length;
    const costPer100Chars = {
      standard: 0.0008,
      neural: 0.0032,
      generative: 0.0064
    };
    
    return (charCount / 100) * costPer100Chars[tier];
  }
  
  private estimateDuration(text: string): number {
    // Rough estimate: 150 words per minute
    const words = text.split(/\s+/).length;
    const minutes = words / 150;
    return Math.ceil(minutes * 60 * 1000); // Convert to milliseconds
  }
  
  async getAvailableVoices(language?: string): Promise<Voice[]> {
    // In production, this would fetch from Twilio API
    // For now, return static list
    const allVoices: Voice[] = [
      // English
      { name: 'Google.en-US-Neural2-A', language: 'en-US', gender: 'female', tier: 'neural' },
      { name: 'Google.en-US-Neural2-D', language: 'en-US', gender: 'male', tier: 'neural' },
      { name: 'Google.en-GB-Neural2-A', language: 'en-GB', gender: 'female', tier: 'neural' },
      { name: 'Google.en-GB-Neural2-B', language: 'en-GB', gender: 'male', tier: 'neural' },
      
      // German
      { name: 'Google.de-DE-Neural2-B', language: 'de-DE', gender: 'male', tier: 'neural' },
      { name: 'Google.de-DE-Neural2-C', language: 'de-DE', gender: 'female', tier: 'neural' },
      
      // Spanish
      { name: 'Google.es-ES-Neural2-A', language: 'es-ES', gender: 'female', tier: 'neural' },
      { name: 'Google.es-ES-Neural2-B', language: 'es-ES', gender: 'male', tier: 'neural' },
      
      // French
      { name: 'Google.fr-FR-Neural2-A', language: 'fr-FR', gender: 'female', tier: 'neural' },
      { name: 'Google.fr-FR-Neural2-B', language: 'fr-FR', gender: 'male', tier: 'neural' },
    ];
    
    if (language) {
      return allVoices.filter(v => v.language.startsWith(language));
    }
    
    return allVoices;
  }
}