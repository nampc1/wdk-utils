export type ValidationSuccess<T extends string> = { success: true; type: T }
export type ValidationFailure = { success: false; reason: string }

export type EvmAddressValidationResult = ValidationSuccess<'evm'> | ValidationFailure

export type BtcAddressValidationResult =
  | ValidationSuccess<'p2pkh' | 'p2sh' | 'bech32'>
  | ValidationFailure

export type SparkAddressValidationResult =
  | ValidationSuccess<'btc' | 'alphanumeric'>
  | ValidationFailure

export type LightningInvoiceValidationResult =
  | ValidationSuccess<'invoice'>
  | ValidationFailure

export type LightningAddressValidationResult =
  | ValidationSuccess<'address'>
  | ValidationFailure

export type UmaAddressValidationResult = ValidationSuccess<'uma'> | ValidationFailure

export function validateEVMAddress(address: string): EvmAddressValidationResult
export function validateBitcoinAddress(address: string): BtcAddressValidationResult
export function validateP2PKH(address: string): BtcAddressValidationResult
export function validateP2SH(address: string): BtcAddressValidationResult
export function validateBech32(address: string): BtcAddressValidationResult
export function validateSparkAddress(address: string): SparkAddressValidationResult
export function validateLightningInvoice(address: string): LightningInvoiceValidationResult
export function validateLightningAddress(address: string): LightningAddressValidationResult
export function stripLightningPrefix(input: string): string
export function validateUmaAddress(address: string): UmaAddressValidationResult
export function resolveUmaUsername(
  uma: string
): { localPart: string; domain: string; lightningAddress: string } | null
