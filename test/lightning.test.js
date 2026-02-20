import { describe, it } from 'node:test';
import assert from 'node:assert';
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
      assert.strictEqual(stripLightningPrefix('lightning:lnbc1xxx'), 'lnbc1xxx');
      assert.strictEqual(stripLightningPrefix('LIGHTNING:lnbc1xxx'), 'lnbc1xxx');
    });
    it('returns unchanged if no prefix', () => {
      assert.strictEqual(stripLightningPrefix('lnbc1xxx'), 'lnbc1xxx');
    });
    it('handles empty or non-string', () => {
      assert.strictEqual(stripLightningPrefix(''), '');
      assert.strictEqual(stripLightningPrefix(null), null);
    });
  });

  describe('isValidLightningInvoice / isLightningInvoice', () => {
    it('accepts lnbc with sufficient length', () => {
      assert.strictEqual(isValidLightningInvoice('lnbc1' + 'x'.repeat(20)), true);
    });
    it('accepts lntb, lnbcrt, lni', () => {
      assert.strictEqual(isValidLightningInvoice('lntb1' + 'x'.repeat(20)), true);
      assert.strictEqual(isValidLightningInvoice('lnbcrt1' + 'x'.repeat(20)), true);
      assert.strictEqual(isValidLightningInvoice('lni1' + 'x'.repeat(20)), true);
    });
    it('rejects too short', () => {
      assert.strictEqual(isValidLightningInvoice('lnbc1short'), false);
    });
    it('rejects non-invoice prefix', () => {
      assert.strictEqual(isValidLightningInvoice('lnxx1' + 'x'.repeat(20)), false);
    });
    it('rejects without ln', () => {
      assert.strictEqual(isValidLightningInvoice('bc1' + 'x'.repeat(20)), false);
    });
    it('strips lightning: before validating', () => {
      assert.strictEqual(isValidLightningInvoice('lightning:lnbc1' + 'x'.repeat(20)), true);
    });
    it('alias isLightningInvoice matches', () => {
      assert.strictEqual(isLightningInvoice('lnbc1' + 'x'.repeat(20)), true);
    });
  });

  describe('isValidLightningAddressFormat / isLightningAddressFormat', () => {
    it('accepts email with dot in domain', () => {
      assert.strictEqual(isValidLightningAddressFormat('user@getalby.com'), true);
      assert.strictEqual(isValidLightningAddressFormat('u@a.co'), true);
    });
    it('rejects without dot in domain', () => {
      assert.strictEqual(isValidLightningAddressFormat('user@localhost'), false);
    });
    it('rejects invalid format', () => {
      assert.strictEqual(isValidLightningAddressFormat('notanemail'), false);
      assert.strictEqual(isValidLightningAddressFormat('@domain.com'), false);
      assert.strictEqual(isValidLightningAddressFormat('user@'), false);
    });
    it('alias isLightningAddressFormat matches', () => {
      assert.strictEqual(isLightningAddressFormat('u@a.co'), true);
    });
  });
});
