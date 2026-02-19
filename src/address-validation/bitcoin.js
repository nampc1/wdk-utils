/**
 * Checks if a string is a valid Pay-to-Script-Hash (P2SH) address.
 * P2SH addresses typically start with a '3' on the Bitcoin mainnet.
 *
 * @param {string} address The address to check.
 * @returns {boolean} True if the address is a valid P2SH address.
 */
export function isP2SH(address) {
  throw new Error('Not implemented');
}

/**
 * Checks if a string is a valid legacy Pay-to-Public-Key-Hash (P2PKH) address.
 * P2PKH addresses typically starts with a '1' on the Bitcoin mainnet.
 *
 * @param {string} address The address to check.
 * @returns {boolean} True if the address is a valid P2PKH address.
 */
export function isP2PKH(address) {
  throw new Error('Not implemented');
}

/**
 * Checks if a string is a valid Bech32 address (SegWit).
 * This includes both Bech32 (P2WPKH/P2WSH, BIP 84) and Bech32m (P2TR, BIP 86).
 * These addresses start with 'bc1'.
 *
 * @param {string} address The address to check.
 * @returns {boolean} True if the address is a valid Bech32 or Bech32m address.
 */
export function isBech32(address) {
  throw new Error('Not implemented');
}

/**
 * Checks if a string is any valid Bitcoin address (P2SH, P2PKH, or Bech32/Bech32m).
 * This is the one-stop-shop validation function.
 *
 * @param {string} address The address to check.
 * @returns {boolean} True if the address is a valid Bitcoin address.
 */
export function isBitcoinAddress(address) {
  throw new Error('Not implemented');
}
