import {
  isValidUmaAddress,
  isUmaAddress,
  resolveUmaUsername,
} from '../src/address-validation/uma.js';

describe('uma', () => {
  const validUma = '$you@uma.money';
  const validUma2 = '$alice@wallet.com';

  describe('isValidUmaAddress', () => {
    it('accepts valid UMA ($user@domain.tld)', () => {
      expect(isValidUmaAddress(validUma)).toBe(true);
      expect(isValidUmaAddress(validUma2)).toBe(true);
      expect(isValidUmaAddress('$x@a.co')).toBe(true);
    });
    it('rejects missing $', () => {
      expect(isValidUmaAddress('you@uma.money')).toBe(false);
    });
    it('rejects invalid format', () => {
      expect(isValidUmaAddress('$no-at-sign')).toBe(false);
      expect(isValidUmaAddress('$@domain.com')).toBe(false);
      expect(isValidUmaAddress('$user@nodot')).toBe(false);
      expect(isValidUmaAddress('')).toBe(false);
      expect(isValidUmaAddress(null)).toBe(false);
    });
    it('trims input', () => {
      expect(isValidUmaAddress('  ' + validUma + '  ')).toBe(true);
    });
  });

  describe('isUmaAddress', () => {
    it('is alias for isValidUmaAddress', () => {
      expect(isUmaAddress(validUma)).toBe(true);
      expect(isUmaAddress('you@uma.money')).toBe(false);
    });
  });

  describe('resolveUmaUsername', () => {
    it('resolves UMA into localPart, domain, and lightningAddress', () => {
      expect(resolveUmaUsername(validUma)).toEqual({
        localPart: 'you',
        domain: 'uma.money',
        lightningAddress: 'you@uma.money',
      });
      expect(resolveUmaUsername(validUma2)).toEqual({
        localPart: 'alice',
        domain: 'wallet.com',
        lightningAddress: 'alice@wallet.com',
      });
    });
    it('returns null for invalid UMA', () => {
      expect(resolveUmaUsername('you@uma.money')).toBe(null);
      expect(resolveUmaUsername('')).toBe(null);
      expect(resolveUmaUsername(null)).toBe(null);
      expect(resolveUmaUsername('$bad')).toBe(null);
    });
    it('trims input', () => {
      expect(resolveUmaUsername('  $you@uma.money  ')).toEqual({
        localPart: 'you',
        domain: 'uma.money',
        lightningAddress: 'you@uma.money',
      });
    });
  });
});
