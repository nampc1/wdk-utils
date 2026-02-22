import {
  isValidBitcoinAddress,
  isBitcoinAddress,
  isP2PKH,
  isP2SH,
  isBech32,
} from '../src/address-validation/bitcoin.js';

describe('bitcoin', () => {
  const validP2PKH = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
  const validP2SH = '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy';
  const validBech32 = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  describe('isValidBitcoinAddress / isBitcoinAddress', () => {
    it('accepts P2PKH (1...)', () => {
      expect(isValidBitcoinAddress(validP2PKH)).toBe(true);
      expect(isBitcoinAddress(validP2PKH)).toBe(true);
    });
    it('accepts P2SH (3...)', () => {
      expect(isValidBitcoinAddress(validP2SH)).toBe(true);
    });
    it('accepts Bech32 (bc1...)', () => {
      expect(isValidBitcoinAddress(validBech32)).toBe(true);
    });
    it('rejects too short P2PKH', () => {
      expect(isValidBitcoinAddress('1' + 'a'.repeat(24))).toBe(false);
    });
    it('rejects invalid base58 char in P2PKH', () => {
      expect(isValidBitcoinAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN' + '0')).toBe(false);
    });
    it('rejects non-Bitcoin strings', () => {
      expect(isValidBitcoinAddress('0x742d35cc6634c0532925a3b844bc454e4438f44e')).toBe(false);
      expect(isValidBitcoinAddress('lnbc1xxx')).toBe(false);
      expect(isValidBitcoinAddress('')).toBe(false);
      expect(isValidBitcoinAddress(null)).toBe(false);
    });
  });

  describe('isP2PKH', () => {
    it('returns true for valid P2PKH', () => {
      expect(isP2PKH(validP2PKH)).toBe(true);
    });
    it('returns false for P2SH', () => {
      expect(isP2PKH(validP2SH)).toBe(false);
    });
    it('returns false for Bech32', () => {
      expect(isP2PKH(validBech32)).toBe(false);
    });
  });

  describe('isP2SH', () => {
    it('returns true for valid P2SH', () => {
      expect(isP2SH(validP2SH)).toBe(true);
    });
    it('returns false for P2PKH', () => {
      expect(isP2SH(validP2PKH)).toBe(false);
    });
  });

  describe('isBech32', () => {
    it('returns true for valid bc1', () => {
      expect(isBech32(validBech32)).toBe(true);
    });
    it('returns false for P2PKH', () => {
      expect(isBech32(validP2PKH)).toBe(false);
    });
  });
});
