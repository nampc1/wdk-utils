/**
 * Bitcoin address validation (aligned with Rumble).
 * Format/length checks only (no base58check or bech32 decode).
 */

const BASE58_CHARS = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

/**
 * Validates a Bitcoin address (format only).
 * Supports: P2PKH (1...), P2SH (3...), Bech32 (bc1...).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidBitcoinAddress(address) {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();

  if (trimmed.startsWith('1') && trimmed.length >= 26 && trimmed.length <= 35) {
    return BASE58_CHARS.test(trimmed);
  }
  if (trimmed.startsWith('3') && trimmed.length >= 26 && trimmed.length <= 35) {
    return BASE58_CHARS.test(trimmed);
  }
  if (trimmed.startsWith('bc1') && trimmed.length >= 14 && trimmed.length <= 74) {
    return /^bc1[a-z0-9]{13,71}$/i.test(trimmed);
  }
  return false;
}

/** Alias for isValidBitcoinAddress (Rumble uses isValidBitcoinAddress). */
export function isBitcoinAddress(address) {
  return isValidBitcoinAddress(address);
}

/**
 * P2SH format (starts with 3, 26-35 base58 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isP2SH(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  return t.startsWith('3') && t.length >= 26 && t.length <= 35 && BASE58_CHARS.test(t);
}

/**
 * P2PKH format (starts with 1, 26-35 base58 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isP2PKH(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  return t.startsWith('1') && t.length >= 26 && t.length <= 35 && BASE58_CHARS.test(t);
}

/**
 * Bech32 format (bc1..., 14-74 chars).
 * @param {string} address
 * @returns {boolean}
 */
export function isBech32(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  return t.startsWith('bc1') && t.length >= 14 && t.length <= 74 && /^bc1[a-z0-9]{13,71}$/i.test(t);
}
