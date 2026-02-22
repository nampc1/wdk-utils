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
      expect(validateEVMAddressDetailed(validLowercase)).toEqual({ isValid: true });
    });
    it('accepts valid EIP-55 checksummed address', () => {
      expect(validateEVMAddressDetailed(validChecksummed)).toEqual({ isValid: true });
    });
    it('returns checksum error for wrong mixed case', () => {
      expect(validateEVMAddressDetailed(invalidChecksum)).toEqual({
        isValid: false,
        error: 'checksum',
      });
    });
    it('returns format error for missing 0x', () => {
      expect(validateEVMAddressDetailed('742d35cc6634c0532925a3b844bc454e4438f44e')).toEqual({
        isValid: false,
        error: 'format',
      });
    });
    it('returns format error for wrong length', () => {
      expect(validateEVMAddressDetailed('0x742d35cc')).toEqual({
        isValid: false,
        error: 'format',
      });
    });
    it('returns format error for non-hex', () => {
      expect(
        validateEVMAddressDetailed('0x742d35cc6634c0532925a3b844bc454e4438f44z')
      ).toEqual({ isValid: false, error: 'format' });
    });
    it('returns format error for empty or non-string', () => {
      expect(validateEVMAddressDetailed('')).toEqual({ isValid: false, error: 'format' });
      expect(validateEVMAddressDetailed(null)).toEqual({ isValid: false, error: 'format' });
    });
    it('trims whitespace', () => {
      expect(validateEVMAddressDetailed('  ' + validLowercase + '  ')).toEqual({
        isValid: true,
      });
    });
  });

  describe('isValidEVMAddress', () => {
    it('returns true for valid addresses', () => {
      expect(isValidEVMAddress(validLowercase)).toBe(true);
      expect(isValidEVMAddress(validChecksummed)).toBe(true);
    });
    it('returns false for invalid checksum mixed case', () => {
      expect(isValidEVMAddress(invalidChecksum)).toBe(false);
    });
    it('returns false for bad format', () => {
      expect(isValidEVMAddress('0xshort')).toBe(false);
    });
  });

  describe('isEvmAddress', () => {
    it('returns true for 0x + 40 hex', () => {
      expect(isEvmAddress(validLowercase)).toBe(true);
      expect(isEvmAddress(validChecksummed)).toBe(true);
    });
    it('returns false for wrong length', () => {
      expect(isEvmAddress('0x' + 'f'.repeat(41))).toBe(false);
    });
  });

  describe('isEip55Checksum', () => {
    it('returns true for valid checksum', () => {
      expect(isEip55Checksum(validChecksummed)).toBe(true);
    });
    it('returns true for all lowercase', () => {
      expect(isEip55Checksum(validLowercase)).toBe(true);
    });
    it('returns false for invalid checksum', () => {
      expect(isEip55Checksum(invalidChecksum)).toBe(false);
    });
  });
});
