export type AddressType =
  | 'evm'
  | 'bitcoin'
  | 'spark'
  | 'lightning-invoice'
  | 'lightning-address'
  | 'lnurl'
  | 'uma'
  | 'username'
  | 'unknown'

/**
 * Check if the input is a plain username (alphanumeric, dots, hyphens, 1-50 chars).
 */
export function isPlainUsername(address: string): boolean

/**
 * Detect the address type using prefix-based routing.
 * Routes to the correct validator based on the address prefix,
 * avoiding fragile waterfall logic.
 */
export function detectAddressType(address: string): AddressType

/**
 * Check if the address is a valid recipient of any supported type.
 */
export function isValidRecipient(address: string): boolean
