import {
  stripLightningPrefix,
  isValidLightningInvoice,
  isValidLightningAddressFormat,
  isLightningInvoice,
  isLightningAddressFormat,
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

  describe('isValidLightningInvoice / isLightningInvoice', () => {
    it('accepts lnbc with sufficient length', () => {
      expect(isValidLightningInvoice('lnbc1' + 'x'.repeat(20))).toBe(true);
    });
    it('accepts lntb, lnbcrt, lni', () => {
      expect(isValidLightningInvoice('lntb1' + 'x'.repeat(20))).toBe(true);
      expect(isValidLightningInvoice('lnbcrt1' + 'x'.repeat(20))).toBe(true);
      expect(isValidLightningInvoice('lni1' + 'x'.repeat(20))).toBe(true);
    });
    it('rejects too short', () => {
      expect(isValidLightningInvoice('lnbc1short')).toBe(false);
    });
    it('rejects non-invoice prefix', () => {
      expect(isValidLightningInvoice('lnxx1' + 'x'.repeat(20))).toBe(false);
    });
    it('rejects without ln', () => {
      expect(isValidLightningInvoice('bc1' + 'x'.repeat(20))).toBe(false);
    });
    it('strips lightning: before validating', () => {
      expect(isValidLightningInvoice('lightning:lnbc1' + 'x'.repeat(20))).toBe(true);
    });
    it('alias isLightningInvoice matches', () => {
      expect(isLightningInvoice('lnbc1' + 'x'.repeat(20))).toBe(true);
    });
  });

  describe('isValidLightningAddressFormat / isLightningAddressFormat', () => {
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
    it('alias isLightningAddressFormat matches', () => {
      expect(isLightningAddressFormat('u@a.co')).toBe(true);
    });
  });
});
