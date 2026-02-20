import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidSparkAddress, isSparkAddress } from '../src/address-validation/spark.js';

describe('spark', () => {
  const validBtc = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const validAlphanumeric = 'a'.repeat(25);

  describe('isValidSparkAddress / isSparkAddress', () => {
    it('accepts Bitcoin-like address', () => {
      assert.strictEqual(isValidSparkAddress(validBtc), true);
      assert.strictEqual(isSparkAddress(validBtc), true);
    });
    it('accepts 20-100 char alphanumeric', () => {
      assert.strictEqual(isValidSparkAddress(validAlphanumeric), true);
      assert.strictEqual(isValidSparkAddress('A1b2C3' + 'x'.repeat(14)), true);
    });
    it('rejects alphanumeric shorter than 20', () => {
      assert.strictEqual(isValidSparkAddress('a'.repeat(19)), false);
    });
    it('rejects alphanumeric longer than 100', () => {
      assert.strictEqual(isValidSparkAddress('a'.repeat(101)), false);
    });
    it('rejects non-alphanumeric in long string', () => {
      assert.strictEqual(isValidSparkAddress('a'.repeat(20) + '-'), false);
    });
    it('rejects empty or non-string', () => {
      assert.strictEqual(isValidSparkAddress(''), false);
      assert.strictEqual(isValidSparkAddress(null), false);
    });
  });
});
