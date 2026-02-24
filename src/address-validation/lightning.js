/**
 * Lightning validation (aligned with Rumble).
 * Invoice prefixes: lnbc, lntb, lnbcrt, lni.
 * Lightning address: strict email (user@domain.tld).
 */

import { bech32 } from '@scure/base';

const VALID_INVOICE_PREFIXES = ['lnbc', 'lntb', 'lnbcrt', 'lni'];
/** Lightning address: must have dot in domain (user@domain.tld) */
const LIGHTNING_ADDRESS_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strips "lightning:" URI prefix (case-insensitive). Does not trim after slice.
 *
 * @param {string} input
 * @returns {string}
 */
export function stripLightningPrefix(input) {
  if (!input || typeof input !== 'string') return input;
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('lightning:')) {
    return trimmed.slice(10);
  }
  return trimmed;
}

/**
 * @typedef {{ success: true } | { success: false, error: Error }} AddressValidationResult
 */

/**
 * Validates a Lightning invoice and returns detailed result.
 *
 * @param {string} address
 * @returns {AddressValidationResult}
 */
export function validateLightningInvoiceDetailed(address) {
  if (isValidLightningInvoice(address)) return { success: true };
  return { success: false, error: new Error('format') };
}

/**
 * Validates a Lightning Network invoice (lnbc, lntb, lnbcrt, lni; length >= 20).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidLightningInvoice(address) {
  if (!address || typeof address !== 'string') return false;
  const invoice = stripLightningPrefix(address);
  if (!invoice.toLowerCase().startsWith('ln')) return false;
  if (invoice.length < 20) return false;
  const hasValidPrefix = VALID_INVOICE_PREFIXES.some((prefix) =>
    invoice.toLowerCase().startsWith(prefix.toLowerCase())
  );
  if (!hasValidPrefix) return false;
  try {
    bech32.decode(invoice.toLowerCase(), false);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates Lightning Address format (email: user@domain.tld).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidLightningAddressFormat(address) {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim().toLowerCase();
  return LIGHTNING_ADDRESS_EMAIL_REGEX.test(trimmed);
}

