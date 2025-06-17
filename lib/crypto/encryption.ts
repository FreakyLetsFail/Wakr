import crypto from 'crypto';
import { customType } from 'drizzle-orm/pg-core';

// Ensure we have a valid encryption key (skip during schema generation)
if (!process.env.ENCRYPTION_KEY && typeof window !== 'undefined') {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : Buffer.alloc(32);
const IV_LENGTH = 16; // AES block size
const SALT_LENGTH = 64; // Salt for key derivation
const TAG_LENGTH = 16; // Auth tag length
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts a string using AES-256-GCM
 * @param text - The plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a string encrypted with AES-256-GCM
 * @param encryptedText - The encrypted string
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Creates a one-way hash for email lookups (GDPR compliant)
 * @param email - Email address to hash
 * @returns SHA-256 hash of the email
 */
export function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

/**
 * Custom Drizzle type for encrypted strings
 * Automatically encrypts on insert/update and decrypts on select
 */
export const encryptedString = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  toDriver(value: string): string {
    return encrypt(value);
  },
  fromDriver(value: string): string {
    return decrypt(value);
  }
});

/**
 * Generates a secure random token
 * @param length - Length of the token in bytes
 * @returns URL-safe base64 encoded token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto
    .randomBytes(length)
    .toString('base64url');
}

/**
 * Validates that a string is properly encrypted
 * @param text - The string to validate
 * @returns true if the string appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  return parts.length === 3 && 
         parts[0].length === IV_LENGTH * 2 && 
         parts[1].length === TAG_LENGTH * 2;
}

/**
 * Key rotation helper - re-encrypts data with a new key
 * @param encryptedText - Text encrypted with old key
 * @param oldKey - Previous encryption key
 * @param newKey - New encryption key
 * @returns Text encrypted with new key
 */
export function rotateEncryption(
  encryptedText: string, 
  oldKey: Buffer, 
  newKey: Buffer
): string {
  // Temporarily use old key to decrypt
  const tempKey = ENCRYPTION_KEY;
  (global as any).ENCRYPTION_KEY = oldKey;
  
  const decrypted = decrypt(encryptedText);
  
  // Use new key to encrypt
  (global as any).ENCRYPTION_KEY = newKey;
  const reencrypted = encrypt(decrypted);
  
  // Restore original key
  (global as any).ENCRYPTION_KEY = tempKey;
  
  return reencrypted;
}