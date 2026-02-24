/**
 * Spark address validation (aligned with Rumble).
 * Accepts: Bitcoin-like address OR alphanumeric string 20-100 chars.
 */

import { isValidBitcoinAddress } from './bitcoin.js';

/**
 * @typedef {{ success: true } | { success: false, error: Error }} AddressValidationResult
 */

/**
 * Validates a Spark address and returns detailed result.
 *
 * @param {string} address
 * @returns {AddressValidationResult}
 */
export function validateSparkAddressDetailed(address) {
  if (isValidSparkAddress(address)) return { success: true };
  return { success: false, error: new Error('format') };
}

/**
 * Validates a Spark address.
 * Rumble: Bitcoin format OR length 20-100 and alphanumeric.
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidSparkAddress(address) {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  if (isValidBitcoinAddress(trimmed)) return true;
  if (trimmed.length >= 20 && trimmed.length <= 100) {
    return /^[a-zA-Z0-9]+$/.test(trimmed);
  }
  return false;
}

/** Alias for isValidSparkAddress. */
export function isSparkAddress(address) {
  return isValidSparkAddress(address);
}
