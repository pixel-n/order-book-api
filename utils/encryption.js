/**
 * ENCRYPTION UTILITY
 * Handles AES-256-CBC encryption and decryption for sensitive shipping details.
 */
const crypto = require('crypto');

const SECRET_KEY = process.env.ENCRYPTION_SECRET; // 32-byte production key (64 hex chars)
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text || !text.includes(':')) return text;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };