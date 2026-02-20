import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateEVMAddressDetailed,
  isValidEVMAddress,
  isEvmAddress,
  isEip55Checksum,
} from '../src/address-validation/evm.js';

describe('evm', () => {
  const validLowercase = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
  const validChecksummed = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const invalidChecksum = '0x742d35CC6634C0532925a3b844Bc454e4438f44e';

  describe('validateEVMAddressDetailed', () => {
    it('accepts all-lowercase address', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed(validLowercase), { isValid: true });
    });
    it('accepts valid EIP-55 checksummed address', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed(validChecksummed), { isValid: true });
    });
    it('returns checksum error for wrong mixed case', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed(invalidChecksum), {
        isValid: false,
        error: 'checksum',
      });
    });
    it('returns format error for missing 0x', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed('742d35cc6634c0532925a3b844bc454e4438f44e'), {
        isValid: false,
        error: 'format',
      });
    });
    it('returns format error for wrong length', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed('0x742d35cc'), {
        isValid: false,
        error: 'format',
      });
    });
    it('returns format error for non-hex', () => {
      assert.deepStrictEqual(
        validateEVMAddressDetailed('0x742d35cc6634c0532925a3b844bc454e4438f44z'),
        { isValid: false, error: 'format' }
      );
    });
    it('returns format error for empty or non-string', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed(''), { isValid: false, error: 'format' });
      assert.deepStrictEqual(validateEVMAddressDetailed(null), { isValid: false, error: 'format' });
    });
    it('trims whitespace', () => {
      assert.deepStrictEqual(validateEVMAddressDetailed('  ' + validLowercase + '  '), {
        isValid: true,
      });
    });
  });

  describe('isValidEVMAddress', () => {
    it('returns true for valid addresses', () => {
      assert.strictEqual(isValidEVMAddress(validLowercase), true);
      assert.strictEqual(isValidEVMAddress(validChecksummed), true);
    });
    it('returns false for invalid checksum mixed case', () => {
      assert.strictEqual(isValidEVMAddress(invalidChecksum), false);
    });
    it('returns false for bad format', () => {
      assert.strictEqual(isValidEVMAddress('0xshort'), false);
    });
  });

  describe('isEvmAddress', () => {
    it('returns true for 0x + 40 hex', () => {
      assert.strictEqual(isEvmAddress(validLowercase), true);
      assert.strictEqual(isEvmAddress(validChecksummed), true);
    });
    it('returns false for wrong length', () => {
      assert.strictEqual(isEvmAddress('0x' + 'f'.repeat(41)), false);
    });
  });

  describe('isEip55Checksum', () => {
    it('returns true for valid checksum', () => {
      assert.strictEqual(isEip55Checksum(validChecksummed), true);
    });
    it('returns true for all lowercase', () => {
      assert.strictEqual(isEip55Checksum(validLowercase), true);
    });
    it('returns false for invalid checksum', () => {
      assert.strictEqual(isEip55Checksum(invalidChecksum), false);
    });
  });
});
