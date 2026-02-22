import {
  isNetworkLightningCapable,
  validateAddressForNetwork,
  validateAddressForNetworkDetailed,
  formatAddressForDisplay,
} from '../src/address-validation/validateForNetwork.js';

const validEvmLower = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
const validBtc = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const validInvoice = 'lnbc1' + 'x'.repeat(50);
const validLightningAddr = 'user@getalby.com';
const validSpark = 'a'.repeat(25);

describe('validateForNetwork', () => {
  describe('isNetworkLightningCapable', () => {
    it('returns true for lightning, ln, spark, bitcoin-spark', () => {
      expect(isNetworkLightningCapable('lightning')).toBe(true);
      expect(isNetworkLightningCapable('ln')).toBe(true);
      expect(isNetworkLightningCapable('spark')).toBe(true);
      expect(isNetworkLightningCapable('bitcoin-spark')).toBe(true);
    });
    it('returns false for EVM or unknown', () => {
      expect(isNetworkLightningCapable('polygon')).toBe(false);
      expect(isNetworkLightningCapable('ethereum')).toBe(false);
    });
    it('returns false for empty/falsy', () => {
      expect(isNetworkLightningCapable('')).toBe(false);
      expect(isNetworkLightningCapable(null)).toBe(false);
    });
  });

  describe('validateAddressForNetwork', () => {
    it('validates EVM for polygon, ethereum, arbitrum, sepolia, plasma', () => {
      expect(validateAddressForNetwork(validEvmLower, 'polygon')).toBe(true);
      expect(validateAddressForNetwork(validEvmLower, 'ethereum')).toBe(true);
      expect(validateAddressForNetwork(validEvmLower, 'arbitrum')).toBe(true);
      expect(validateAddressForNetwork(validEvmLower, 'sepolia')).toBe(true);
      expect(validateAddressForNetwork(validEvmLower, 'plasma')).toBe(true);
    });
    it('validates Bitcoin for bitcoin network', () => {
      expect(validateAddressForNetwork(validBtc, 'bitcoin')).toBe(true);
    });
    it('validates Lightning invoice or address for lightning/ln', () => {
      expect(validateAddressForNetwork(validInvoice, 'lightning')).toBe(true);
      expect(validateAddressForNetwork(validLightningAddr, 'ln')).toBe(true);
    });
    it('validates Lightning or Spark for spark/bitcoin-spark', () => {
      expect(validateAddressForNetwork(validSpark, 'spark')).toBe(true);
      expect(validateAddressForNetwork(validInvoice, 'bitcoin-spark')).toBe(true);
    });
    it('returns false for empty address or network', () => {
      expect(validateAddressForNetwork('', 'polygon')).toBe(false);
      expect(validateAddressForNetwork(validEvmLower, '')).toBe(false);
    });
  });

  describe('validateAddressForNetworkDetailed', () => {
    it('returns detailed EVM result for EVM networks', () => {
      expect(validateAddressForNetworkDetailed(validEvmLower, 'polygon')).toEqual({
        isValid: true,
      });
      expect(validateAddressForNetworkDetailed('0xshort', 'polygon')).toEqual({
        isValid: false,
        error: 'format',
      });
    });
    it('returns format error when address or network missing', () => {
      expect(validateAddressForNetworkDetailed('', 'polygon')).toEqual({
        isValid: false,
        error: 'format',
      });
      expect(validateAddressForNetworkDetailed(validEvmLower, '')).toEqual({
        isValid: false,
        error: 'format',
      });
    });
    it('returns isValid + error for non-EVM', () => {
      const ok = validateAddressForNetworkDetailed(validBtc, 'bitcoin');
      expect(ok.isValid).toBe(true);
      expect(ok.error).toBeUndefined();
      expect(validateAddressForNetworkDetailed('invalid', 'bitcoin')).toEqual({
        isValid: false,
        error: 'format',
      });
    });
  });

  describe('formatAddressForDisplay', () => {
    it('truncates long address with default 6...4', () => {
      expect(formatAddressForDisplay(validEvmLower)).toBe('0x742d...f44e');
    });
    it('returns short address as-is', () => {
      expect(formatAddressForDisplay('short')).toBe('short');
    });
    it('accepts custom start/end chars', () => {
      expect(formatAddressForDisplay(validEvmLower, 8, 6)).toBe('0x742d35...38f44e');
    });
  });
});
