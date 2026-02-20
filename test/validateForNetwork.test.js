import { describe, it } from 'node:test';
import assert from 'node:assert';
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
      assert.strictEqual(isNetworkLightningCapable('lightning'), true);
      assert.strictEqual(isNetworkLightningCapable('ln'), true);
      assert.strictEqual(isNetworkLightningCapable('spark'), true);
      assert.strictEqual(isNetworkLightningCapable('bitcoin-spark'), true);
    });
    it('returns false for EVM or unknown', () => {
      assert.strictEqual(isNetworkLightningCapable('polygon'), false);
      assert.strictEqual(isNetworkLightningCapable('ethereum'), false);
    });
    it('returns false for empty/falsy', () => {
      assert.strictEqual(isNetworkLightningCapable(''), false);
      assert.strictEqual(isNetworkLightningCapable(null), false);
    });
  });

  describe('validateAddressForNetwork', () => {
    it('validates EVM for polygon, ethereum, arbitrum, sepolia, plasma', () => {
      assert.strictEqual(validateAddressForNetwork(validEvmLower, 'polygon'), true);
      assert.strictEqual(validateAddressForNetwork(validEvmLower, 'ethereum'), true);
      assert.strictEqual(validateAddressForNetwork(validEvmLower, 'arbitrum'), true);
      assert.strictEqual(validateAddressForNetwork(validEvmLower, 'sepolia'), true);
      assert.strictEqual(validateAddressForNetwork(validEvmLower, 'plasma'), true);
    });
    it('validates Bitcoin for bitcoin network', () => {
      assert.strictEqual(validateAddressForNetwork(validBtc, 'bitcoin'), true);
    });
    it('validates Lightning invoice or address for lightning/ln', () => {
      assert.strictEqual(validateAddressForNetwork(validInvoice, 'lightning'), true);
      assert.strictEqual(validateAddressForNetwork(validLightningAddr, 'ln'), true);
    });
    it('validates Lightning or Spark for spark/bitcoin-spark', () => {
      assert.strictEqual(validateAddressForNetwork(validSpark, 'spark'), true);
      assert.strictEqual(validateAddressForNetwork(validInvoice, 'bitcoin-spark'), true);
    });
    it('returns false for empty address or network', () => {
      assert.strictEqual(validateAddressForNetwork('', 'polygon'), false);
      assert.strictEqual(validateAddressForNetwork(validEvmLower, ''), false);
    });
  });

  describe('validateAddressForNetworkDetailed', () => {
    it('returns detailed EVM result for EVM networks', () => {
      assert.deepStrictEqual(validateAddressForNetworkDetailed(validEvmLower, 'polygon'), {
        isValid: true,
      });
      assert.deepStrictEqual(
        validateAddressForNetworkDetailed('0xshort', 'polygon'),
        { isValid: false, error: 'format' }
      );
    });
    it('returns format error when address or network missing', () => {
      assert.deepStrictEqual(validateAddressForNetworkDetailed('', 'polygon'), {
        isValid: false,
        error: 'format',
      });
      assert.deepStrictEqual(validateAddressForNetworkDetailed(validEvmLower, ''), {
        isValid: false,
        error: 'format',
      });
    });
    it('returns isValid + error for non-EVM', () => {
      const ok = validateAddressForNetworkDetailed(validBtc, 'bitcoin');
      assert.strictEqual(ok.isValid, true);
      assert.strictEqual(ok.error, undefined);
      assert.deepStrictEqual(validateAddressForNetworkDetailed('invalid', 'bitcoin'), {
        isValid: false,
        error: 'format',
      });
    });
  });

  describe('formatAddressForDisplay', () => {
    it('truncates long address with default 6...4', () => {
      assert.strictEqual(
        formatAddressForDisplay(validEvmLower),
        '0x742d...f44e'
      );
    });
    it('returns short address as-is', () => {
      assert.strictEqual(formatAddressForDisplay('short'), 'short');
    });
    it('accepts custom start/end chars', () => {
      assert.strictEqual(
        formatAddressForDisplay(validEvmLower, 8, 6),
        '0x742d35...38f44e'
      );
    });
  });
});
