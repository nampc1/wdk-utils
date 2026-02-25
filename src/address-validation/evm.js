/**
 * EVM address validation.
 * EIP-55 checksum: if all lowercase, valid; if mixed case, must match checksum.
 * @see https://eips.ethereum.org/EIPS/eip-55
 */

import { keccak_256 } from '@noble/hashes/sha3';

function isValidEIP55Checksum(address) {
  const hexPart = address.slice(2);
  if (hexPart === hexPart.toLowerCase()) {
    return true;
  }
  const addressLower = address.toLowerCase();
  const addressWithoutPrefix = addressLower.slice(2);
  try {
    const addressBytes = new TextEncoder().encode(addressWithoutPrefix);
    const hashBytes = keccak_256(addressBytes);
    const hash = Array.from(hashBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    let checksummed = '0x';
    for (let i = 0; i < addressWithoutPrefix.length; i++) {
      const char = addressWithoutPrefix[i];
      const hashChar = hash[i];
      if (parseInt(hashChar, 16) >= 8) {
        checksummed += char.toUpperCase();
      } else {
        checksummed += char;
      }
    }
    return address === checksummed;
  } catch {
    return false;
  }
}

/**
 * @typedef {{ success: true } | { success: false, error: Error }} AddressValidationResult
 */

/**
 * Validates an EVM address and returns detailed result (format + optional EIP-55 checksum).
 * If mixed case, checksum must match; all lowercase is valid.
 *
 * @param {string} address
 * @returns {AddressValidationResult}
 */
export function validateEVMAddressDetailed(address) {
  if (!address || typeof address !== 'string') {
    return { success: false, error: new Error('format') };
  }
  const trimmed = address.trim();
  if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
    return { success: false, error: new Error('format') };
  }
  const hexPart = trimmed.slice(2);
  if (!/^[0-9a-fA-F]{40}$/.test(hexPart)) {
    return { success: false, error: new Error('format') };
  }
  const isAllLowercase = hexPart === hexPart.toLowerCase();
  const isAllUppercase = hexPart === hexPart.toUpperCase();
  const hasMixedCase = !isAllLowercase && !isAllUppercase;
  if (hasMixedCase && !isValidEIP55Checksum(trimmed)) {
    return { success: false, error: new Error('checksum') };
  }
  return { success: true };
}

/**
 * Validates an EVM address (Ethereum, Polygon, Arbitrum, etc.).
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isValidEVMAddress(address) {
  const result = validateEVMAddressDetailed(address);
  return result.success;
}

/** @deprecated Use isValidEVMAddress. Format-only check (0x + 40 hex). */
export function isEvmAddress(address) {
  return typeof address === 'string' && /^0x[0-9a-fA-F]{40}$/.test(address.trim());
}

/** @deprecated Use validateEVMAddressDetailed for checksum. All-lowercase passes; mixed case requires valid EIP-55. */
export function isEip55Checksum(address) {
  if (!address || typeof address !== 'string') return false;
  const t = address.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(t)) return false;
  return isValidEIP55Checksum(t);
}
