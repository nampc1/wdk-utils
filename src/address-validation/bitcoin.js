import { createBase58check, bech32 } from '@scure/base';
import { sha256 } from '@noble/hashes/sha256';

/**
 * Bitcoin address validation (aligned with Rumble).
 * Validates format, checksum, and version byte.
 */

const base58check = createBase58check(sha256);

/**
 * @typedef {{ success: true } | { success: false, error: Error }} AddressValidationResult
 */

/**
 * Validates a Bitcoin address and returns detailed result.
 * Supports: P2PKH (1...), P2SH (3...), Bech32 (bc1...).
 *
 * @param {string} address
 * @returns {AddressValidationResult}
 */
export function validateBitcoinAddressDetailed(address) {
  if (isValidBitcoinAddress(address)) return { success: true };
  return { success: false, error: new Error('format') };
}

/**
 * Validates a Bitcoin address.
 * Supports: P2PKH (1...), P2SH (3...), Bech32 (bc1...).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidBitcoinAddress(address) {
  return isP2PKH(address) || isP2SH(address) || isBech32(address);
}

/**
 * P2SH format (starts with 3, 26-35 base58 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isP2SH(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  if (!t.startsWith('3') || t.length < 26 || t.length > 35) return false;

  try {
    const decoded = base58check.decode(t);
    return decoded[0] === 0x05;
  } catch {
    return false;
  }
}

/**
 * P2PKH format (starts with 1, 26-35 base58 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isP2PKH(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  if (!t.startsWith('1') || t.length < 26 || t.length > 35) return false;

  try {
    const decoded = base58check.decode(t);
    return decoded[0] === 0x00;
  } catch {
    return false;
  }
}

/**
 * Bech32 format (bc1..., 14-74 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isBech32(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim().toLowerCase();
  if (!t.startsWith('bc1')) return false;

  try {
    const { prefix } = bech32.decode(t);
    return prefix === 'bc';
  } catch {
    return false;
  }
}
