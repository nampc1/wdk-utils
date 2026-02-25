/**
 * Spark address validation.
 * Accepts: Bitcoin-like address OR alphanumeric string 20-100 chars.
 */

import { validateBitcoinAddress } from './bitcoin.js';

/**
 * @typedef {{ success: true, type: 'btc' | 'alphanumeric' }} SparkAddressValidationSuccess
 * @typedef {{ success: false, reason: string }} SparkAddressValidationFailure
 * @typedef {SparkAddressValidationSuccess | SparkAddressValidationFailure} SparkAddressValidationResult
 */

/**
 * Validates a Spark address.
 * Accepts Bitcoin format or alphanumeric string (20-100 chars).
 *
 * @param {string} address The address to validate.
 * @returns {SparkAddressValidationResult}
 */
export function validateSparkAddress(address) {
  if (!address || typeof address !== 'string') {
    return { success: false, reason: 'INVALID_FORMAT' };
  }
  const trimmed = address.trim();
  if (trimmed.length === 0) {
    return { success: false, reason: 'EMPTY_ADDRESS' };
  }
  if (validateBitcoinAddress(trimmed).success) {
    return { success: true, type: 'btc' };
  }
  if (trimmed.length >= 20 && trimmed.length <= 100 && /^[a-zA-Z0-9]+$/.test(trimmed)) {
    return { success: true, type: 'alphanumeric' };
  }
  return { success: false, reason: 'INVALID_FORMAT' };
}
