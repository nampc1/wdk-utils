import { isValidSparkAddress, isSparkAddress } from '../src/address-validation/spark.js';

describe('spark', () => {
  const validBtc = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const validAlphanumeric = 'a'.repeat(25);

  describe('isValidSparkAddress / isSparkAddress', () => {
    it('accepts Bitcoin-like address', () => {
      expect(isValidSparkAddress(validBtc)).toBe(true);
      expect(isSparkAddress(validBtc)).toBe(true);
    });
    it('accepts 20-100 char alphanumeric', () => {
      expect(isValidSparkAddress(validAlphanumeric)).toBe(true);
      expect(isValidSparkAddress('A1b2C3' + 'x'.repeat(14))).toBe(true);
    });
    it('rejects alphanumeric shorter than 20', () => {
      expect(isValidSparkAddress('a'.repeat(19))).toBe(false);
    });
    it('rejects alphanumeric longer than 100', () => {
      expect(isValidSparkAddress('a'.repeat(101))).toBe(false);
    });
    it('rejects non-alphanumeric in long string', () => {
      expect(isValidSparkAddress('a'.repeat(20) + '-')).toBe(false);
    });
    it('rejects empty or non-string', () => {
      expect(isValidSparkAddress('')).toBe(false);
      expect(isValidSparkAddress(null)).toBe(false);
    });
  });
});
