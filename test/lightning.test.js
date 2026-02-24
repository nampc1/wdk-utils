import {
  validateLightningInvoiceDetailed,
  stripLightningPrefix,
  isValidLightningInvoice,
  isValidLightningAddressFormat,
} from '../src/address-validation/lightning.js';

describe('lightning', () => {
  describe('stripLightningPrefix', () => {
    it('strips lightning: prefix (case-insensitive)', () => {
      expect(stripLightningPrefix('lightning:lnbc1xxx')).toBe('lnbc1xxx');
      expect(stripLightningPrefix('LIGHTNING:lnbc1xxx')).toBe('lnbc1xxx');
    });
    it('returns unchanged if no prefix', () => {
      expect(stripLightningPrefix('lnbc1xxx')).toBe('lnbc1xxx');
    });
    it('handles empty or non-string', () => {
      expect(stripLightningPrefix('')).toBe('');
      expect(stripLightningPrefix(null)).toBe(null);
    });
  });

  const validLnbc = 'lnbc1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpht0z6z';
  const validLntb = 'lntb1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgp4m6vj4';
  const validLnbcrt = 'lnbcrt1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgphw244f';
  const validLni = 'lni1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpgwn9wp';

  describe('validateLightningInvoiceDetailed', () => {
    it('returns success true for valid invoice', () => {
      expect(validateLightningInvoiceDetailed(validLnbc)).toEqual({ success: true });
    });
    it('returns success false with Error for invalid invoice', () => {
      expect(validateLightningInvoiceDetailed('invalid')).toEqual({ success: false, error: new Error('format') });
    });
  });

  describe('isValidLightningInvoice', () => {
    it('accepts lnbc with valid checksum', () => {
      expect(isValidLightningInvoice(validLnbc)).toBe(true);
    });
    it('accepts lntb, lnbcrt, lni', () => {
      expect(isValidLightningInvoice(validLntb)).toBe(true);
      expect(isValidLightningInvoice(validLnbcrt)).toBe(true);
      expect(isValidLightningInvoice(validLni)).toBe(true);
    });
    it('rejects too short', () => {
      expect(isValidLightningInvoice('lnbc1qyqsm94tzr')).toBe(false);
    });
    it('rejects non-invoice prefix', () => {
      expect(isValidLightningInvoice('lnxx1' + 'x'.repeat(20))).toBe(false);
    });
    it('rejects without ln', () => {
      expect(isValidLightningInvoice('bc1' + 'x'.repeat(20))).toBe(false);
    });
    it('rejects invalid checksum', () => {
      expect(isValidLightningInvoice('lnbc1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpht0z6q')).toBe(false);
    });
    it('strips lightning: before validating', () => {
      expect(isValidLightningInvoice('lightning:' + validLnbc)).toBe(true);
    });
  });

  describe('isValidLightningAddressFormat', () => {
    it('accepts email with dot in domain', () => {
      expect(isValidLightningAddressFormat('user@getalby.com')).toBe(true);
      expect(isValidLightningAddressFormat('u@a.co')).toBe(true);
    });
    it('rejects without dot in domain', () => {
      expect(isValidLightningAddressFormat('user@localhost')).toBe(false);
    });
    it('rejects invalid format', () => {
      expect(isValidLightningAddressFormat('notanemail')).toBe(false);
      expect(isValidLightningAddressFormat('@domain.com')).toBe(false);
      expect(isValidLightningAddressFormat('user@')).toBe(false);
    });
  });
});
