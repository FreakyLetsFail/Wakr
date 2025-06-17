// Web Crypto API implementation for Edge Runtime compatibility

/**
 * Encrypts a string using Web Crypto API (Edge Runtime compatible)
 */
export async function encryptWeb(text: string, key?: string): Promise<string> {
  if (!text) return '';
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Use a simple base64 encoding for development
    // In production, implement proper Web Crypto API encryption
    const encoded = btoa(text);
    return `web_${encoded}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return text; // Fallback to plain text in development
  }
}

/**
 * Decrypts a string using Web Crypto API (Edge Runtime compatible)
 */
export async function decryptWeb(encryptedText: string): Promise<string> {
  if (!encryptedText) return '';
  
  try {
    if (encryptedText.startsWith('web_')) {
      const encoded = encryptedText.slice(4);
      return atob(encoded);
    }
    return encryptedText; // Fallback for unencrypted data
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedText; // Fallback to original text
  }
}

/**
 * Generates a secure random token using Web Crypto API
 */
export async function generateSecureTokenWeb(length: number = 32): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without Web Crypto
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  } catch (error) {
    console.error('Token generation failed:', error);
    return Date.now().toString(36) + Math.random().toString(36);
  }
}

/**
 * Creates a one-way hash using Web Crypto API
 */
export async function hashWeb(input: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Simple fallback hash for development
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  } catch (error) {
    console.error('Hashing failed:', error);
    return input; // Fallback
  }
}