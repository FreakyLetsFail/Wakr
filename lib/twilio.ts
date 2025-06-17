import twilio from 'twilio';
import { EU_LANGUAGES, type LanguageCode } from './constants';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Missing Twilio credentials');
}

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

// Voice call service
export class TwilioVoiceService {
  static async makeWakeUpCall(
    phoneNumber: string,
    userLanguage: LanguageCode = 'en',
    userName: string = 'there'
  ) {
    try {
      const call = await twilioClient.calls.create({
        to: phoneNumber,
        from: TWILIO_PHONE_NUMBER,
        url: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice`,
        method: 'POST',
        statusCallback: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/status`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        timeout: 30,
        record: false
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status
      };
    } catch (error) {
      console.error('Failed to make wake-up call:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async makeTestCall(phoneNumber: string, verificationCode: string) {
    try {
      const call = await twilioClient.calls.create({
        to: phoneNumber,
        from: TWILIO_PHONE_NUMBER,
        url: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice/test?code=${verificationCode}`,
        method: 'POST',
        timeout: 20
      });

      return {
        success: true,
        callSid: call.sid,
        verificationCode
      };
    } catch (error) {
      console.error('Failed to make test call:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async makeCustomCall(
    phoneNumber: string,
    message: string,
    userLanguage: LanguageCode = 'en'
  ) {
    try {
      const call = await twilioClient.calls.create({
        to: phoneNumber,
        from: TWILIO_PHONE_NUMBER,
        url: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice/custom`,
        method: 'POST',
        statusCallback: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/status`,
        statusCallbackMethod: 'POST'
      });

      return {
        success: true,
        callSid: call.sid
      };
    } catch (error) {
      console.error('Failed to make custom call:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// TwiML generation helpers
export class TwiMLGenerator {
  static generateWakeUpResponse(
    userName: string,
    language: LanguageCode = 'en',
    customMessage?: string
  ): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    const greetings = {
      en: `Good morning ${userName}! Time to wake up.`,
      de: `Guten Morgen ${userName}! Zeit aufzustehen.`,
      fr: `Bonjour ${userName}! Il est temps de se réveiller.`,
      es: `Buenos días ${userName}! Es hora de levantarse.`,
      it: `Buongiorno ${userName}! È ora di alzarsi.`,
      pt: `Bom dia ${userName}! Hora de acordar.`,
      nl: `Goedemorgen ${userName}! Tijd om op te staan.`,
      pl: `Dzień dobry ${userName}! Czas wstawać.`,
      sv: `God morgon ${userName}! Dags att vakna.`,
      da: `God morgen ${userName}! Tid at vågne.`,
      fi: `Hyvää huomenta ${userName}! Aika herätä.`,
      el: `Καλημέρα ${userName}! Ώρα να ξυπνήσεις.`,
      cs: `Dobré ráno ${userName}! Čas vstávat.`,
      hu: `Jó reggelt ${userName}! Ideje felkelni.`,
      ro: `Bună dimineața ${userName}! E timpul să te trezești.`,
      bg: `Добро утро ${userName}! Време е да станеш.`,
      hr: `Dobro jutro ${userName}! Vrijeme je za ustajanje.`,
      sk: `Dobré ráno ${userName}! Čas vstávať.`,
      sl: `Dobro jutro ${userName}! Čas je za vstajanje.`,
      et: `Tere hommikust ${userName}! Aeg ärgata.`,
      lv: `Labrīt ${userName}! Laiks mosties.`,
      lt: `Labas rytas ${userName}! Laikas keltis.`,
      mt: `Bonġu ${userName}! Ħin li tqum.`,
      ga: `Maidin mhaith ${userName}! Am éirí.`
    };

    const challengePrompts = {
      en: "Your wake-up challenge is waiting for you in the app.",
      de: "Ihre Wake-Up-Challenge wartet in der App auf Sie.",
      fr: "Votre défi de réveil vous attend dans l'application.",
      es: "Tu desafío de despertar te espera en la aplicación.",
      it: "La tua sfida di risveglio ti aspetta nell'app.",
      pt: "Seu desafio de despertar está esperando no aplicativo.",
      nl: "Je wake-up challenge wacht op je in de app.",
      pl: "Twoje wyzwanie porannego budzenia czeka w aplikacji.",
      sv: "Din väckningsutmaning väntar på dig i appen.",
      da: "Din vækning udfordring venter på dig i appen.",
      fi: "Herätyshaasteesi odottaa sinua sovelluksessa.",
      el: "Η πρόκληση αφύπνισής σας σας περιμένει στην εφαρμογή.",
      cs: "Vaše ranní výzva vás čeká v aplikaci.",
      hu: "Az ébresztő kihívásod vár az alkalmazásban.",
      ro: "Provocarea ta de trezire te așteaptă în aplicație.",
      bg: "Предизвикателството ви за събуждане ви чака в приложението.",
      hr: "Vaš izazov buđenja čeka vas u aplikaciji.",
      sk: "Vaša ranná výzva vás čeká v aplikácii.",
      sl: "Vaš izziv zbujanja vas čaka v aplikaciji.",
      et: "Teie äratamise väljakutse ootab teid rakenduses.",
      lv: "Jūsu modināšanas izaicinājums gaida jūs lietotnē.",
      lt: "Jūsų pažadinimo iššūkis laukia jūsų programėlėje.",
      mt: "L-isfida tiegħek biex tqum qed tistenniek fl-app.",
      ga: "Tá do dhúshlán dúiseachta ag fanacht leat san aip."
    };

    // Greeting
    twiml.say(
      customMessage || greetings[language] || greetings.en,
      {
        language: EU_LANGUAGES[language]?.twilio || 'en-US',
        voice: 'Polly.Amy'
      }
    );

    // Challenge prompt
    twiml.say(
      challengePrompts[language] || challengePrompts.en,
      {
        language: EU_LANGUAGES[language]?.twilio || 'en-US',
        voice: 'Polly.Amy'
      }
    );

    // End call after message
    twiml.say('Have a great day!', {
      language: EU_LANGUAGES[language]?.twilio || 'en-US',
      voice: 'Polly.Amy'
    });

    return twiml.toString();
  }

  static generateTestCallResponse(verificationCode: string): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    twiml.say('Welcome to Wakr! This is your test call.', {
      language: 'en-US',
      voice: 'Polly.Amy'
    });

    const gather = twiml.gather({
      numDigits: verificationCode.length,
      action: `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice/verify-test`,
      method: 'POST',
      timeout: 15
    });

    gather.say(
      `Please enter the following code on your keypad: ${verificationCode.split('').join(' ')}`,
      {
        language: 'en-US',
        voice: 'Polly.Amy'
      }
    );

    twiml.say('Thank you! Your phone verification is complete.', {
      language: 'en-US',
      voice: 'Polly.Amy'
    });

    return twiml.toString();
  }

  static generateCustomCallResponse(message: string, language: LanguageCode = 'en'): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    twiml.say(message, {
      language: EU_LANGUAGES[language]?.twilio || 'en-US',
      voice: 'Polly.Amy'
    });

    return twiml.toString();
  }

  static generateErrorResponse(): string {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    twiml.say('Sorry, there was an error processing your call. Please try again later.', {
      language: 'en-US',
      voice: 'Polly.Amy'
    });

    return twiml.toString();
  }
}

// Phone number validation and formatting
export class PhoneNumberService {
  static formatForTwilio(phone: string, countryCode: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (!digits.startsWith(countryCode.replace('+', ''))) {
      return `${countryCode}${digits}`;
    }
    
    return `+${digits}`;
  }

  static isValidPhoneNumber(phone: string): boolean {
    // Basic validation - should be at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }
}

// Webhook signature validation
export function validateTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  return twilio.validateRequest(authToken, signature, url, params);
}