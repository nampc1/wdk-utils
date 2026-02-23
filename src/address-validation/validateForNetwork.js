/**
 * Network-aware address validation (aligned with Rumble addressValidation).
 */

import { validateEVMAddressDetailed, isValidEVMAddress } from './evm.js';
import { isValidBitcoinAddress } from './bitcoin.js';
import { isValidLightningInvoice, isValidLightningAddressFormat } from './lightning.js';
import { isValidSparkAddress } from './spark.js';
import { isValidUmaAddress } from './uma.js';

const EVM_NETWORKS = ['ethereum', 'polygon', 'arbitrum', 'sepolia', 'plasma'];
const LIGHTNING_CAPABLE_NETWORKS = ['lightning', 'ln', 'spark', 'bitcoin-spark', 'uma'];

/**
 * True when the network supports Lightning addresses and invoices (e.g. BTC send).
 *
 * @param {string} [network]
 * @returns {boolean}
 */
export function isNetworkLightningCapable(network) {
  if (!network) return false;
  return LIGHTNING_CAPABLE_NETWORKS.includes(network.toLowerCase());
}
/**
 * Validates address for network (boolean). Used by validateAddressForNetworkDetailed for non-EVM.
 *
 * @param {string} address
 * @param {string} network
 * @param {string} [_tokenSymbol]
 * @returns {boolean}
 */
export function validateAddressForNetwork(address, network, _tokenSymbol) {
  if (!address || !network) return false;
  const trimmed = address.trim();
  const net = network.toLowerCase();

  if (EVM_NETWORKS.includes(net)) {
    return isValidEVMAddress(trimmed);
  }
  if (net === 'lightning' || net === 'ln') {
    return (
      isValidLightningInvoice(trimmed) ||
      isValidLightningAddressFormat(trimmed) ||
      isValidUmaAddress(trimmed)
    );
  }
  if (net === 'uma') {
    return isValidUmaAddress(trimmed);
  }
  if (net === 'spark' || net === 'bitcoin-spark') {
    return (
      isValidLightningInvoice(trimmed) ||
      isValidLightningAddressFormat(trimmed) ||
      isValidUmaAddress(trimmed) ||
      isValidSparkAddress(trimmed)
    );
  }
  if (net === 'bitcoin') {
    return isValidBitcoinAddress(trimmed);
  }
  return (
    isValidEVMAddress(trimmed) ||
    isValidBitcoinAddress(trimmed) ||
    isValidLightningInvoice(trimmed) ||
    isValidLightningAddressFormat(trimmed) ||
    isValidUmaAddress(trimmed) ||
    isValidSparkAddress(trimmed)
  );
}

/**
 * @typedef {{ isValid: boolean; error?: 'format'|'checksum' }} ValidateAddressDetailedResult
 */

/**
 * Validates address for network; returns detailed result (error: 'format' | 'checksum' for EVM).
 *
 * @param {string} address
 * @param {string} network
 * @param {string} [tokenSymbol]
 * @returns {ValidateAddressDetailedResult}
 */
export function validateAddressForNetworkDetailed(address, network, tokenSymbol) {
  if (!address || !network) {
    return { isValid: false, error: 'format' };
  }
  const trimmed = address.trim();
  const net = network.toLowerCase();

  if (EVM_NETWORKS.includes(net)) {
    const result = validateEVMAddressDetailed(trimmed);
    return result;
  }
  const isValid = validateAddressForNetwork(trimmed, network, tokenSymbol);
  return { isValid, error: isValid ? undefined : 'format' };
}

/**
 * Truncates address for display (e.g. 0x1234...5678).
 *
 * @param {string} address
 * @param {number} [startChars=6]
 * @param {number} [endChars=4]
 * @returns {string}
 */
export function formatAddressForDisplay(address, startChars = 6, endChars = 4) {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
