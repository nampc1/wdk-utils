import { describe, it } from 'node:test';
import assert from 'node:assert';
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
      assert.strictEqual(isValidBitcoinAddress(validP2PKH), true);
      assert.strictEqual(isBitcoinAddress(validP2PKH), true);
    });
    it('accepts P2SH (3...)', () => {
      assert.strictEqual(isValidBitcoinAddress(validP2SH), true);
    });
    it('accepts Bech32 (bc1...)', () => {
      assert.strictEqual(isValidBitcoinAddress(validBech32), true);
    });
    it('rejects too short P2PKH', () => {
      assert.strictEqual(isValidBitcoinAddress('1' + 'a'.repeat(24)), false);
    });
    it('rejects invalid base58 char in P2PKH', () => {
      assert.strictEqual(isValidBitcoinAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN' + '0'), false);
    });
    it('rejects non-Bitcoin strings', () => {
      assert.strictEqual(isValidBitcoinAddress('0x742d35cc6634c0532925a3b844bc454e4438f44e'), false);
      assert.strictEqual(isValidBitcoinAddress('lnbc1xxx'), false);
      assert.strictEqual(isValidBitcoinAddress(''), false);
      assert.strictEqual(isValidBitcoinAddress(null), false);
    });
  });

  describe('isP2PKH', () => {
    it('returns true for valid P2PKH', () => {
      assert.strictEqual(isP2PKH(validP2PKH), true);
    });
    it('returns false for P2SH', () => {
      assert.strictEqual(isP2PKH(validP2SH), false);
    });
    it('returns false for Bech32', () => {
      assert.strictEqual(isP2PKH(validBech32), false);
    });
  });

  describe('isP2SH', () => {
    it('returns true for valid P2SH', () => {
      assert.strictEqual(isP2SH(validP2SH), true);
    });
    it('returns false for P2PKH', () => {
      assert.strictEqual(isP2SH(validP2PKH), false);
    });
  });

  describe('isBech32', () => {
    it('returns true for valid bc1', () => {
      assert.strictEqual(isBech32(validBech32), true);
    });
    it('returns false for P2PKH', () => {
      assert.strictEqual(isBech32(validP2PKH), false);
    });
  });
});
