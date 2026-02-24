/**
 * Universal Money Address (UMA) validation.
 * Format: $user@domain.tld (human-readable, like email for money; built on Lightning).
 * Resolves UMA usernames into the underlying Lightning Address (user@domain).
 */

/** UMA format: leading $ then local@domain with dot in domain */
const UMA_REGEX = /^\$([^\s@]+)@([^\s@]+\.[^\s@]+)$/;

/**
 * @typedef {{ success: true } | { success: false, error: Error }} AddressValidationResult
 */

/**
 * Validates a UMA address and returns detailed result.
 *
 * @param {string} address
 * @returns {AddressValidationResult}
 */
export function validateUmaAddressDetailed(address) {
  if (isValidUmaAddress(address)) return { success: true };
  return { success: false, error: new Error('format') };
}

/**
 * Validates a Universal Money Address (format: $user@domain.tld).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidUmaAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return UMA_REGEX.test(address.trim());
}

/** Alias for isValidUmaAddress. */
export function isUmaAddress(address) {
  return isValidUmaAddress(address);
}

/**
 * Resolves UMA username into address components and the underlying Lightning Address.
 * UMA is built on Lightning Addresses; this returns the user@domain form used for resolution.
 *
 * @param {string} uma - UMA string (e.g. $you@uma.money)
 * @returns {{ localPart: string; domain: string; lightningAddress: string } | null} Parsed parts and lightningAddress (user@domain), or null if invalid
 */
export function resolveUmaUsername(uma) {
  if (!uma || typeof uma !== 'string') return null;
  const trimmed = uma.trim();
  const match = trimmed.match(UMA_REGEX);
  if (!match) return null;
  const [, localPart, domain] = match;
  const lightningAddress = `${localPart}@${domain}`;
  return { localPart, domain, lightningAddress };
}
