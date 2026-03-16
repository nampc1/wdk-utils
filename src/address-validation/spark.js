// Copyright 2026 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

import { bech32m } from '@scure/base'
import { validateBitcoinAddress } from './bitcoin.js'

/**
 * @typedef {{ success: true, type: 'spark' | 'btc' }} SparkAddressValidationSuccess
 * @typedef {{ success: false, reason: string }} SparkAddressValidationFailure
 * @typedef {SparkAddressValidationSuccess | SparkAddressValidationFailure} SparkAddressValidationResult
 */

const VALID_PREFIXES = ['spark', 'sparkrt', 'sparkt', 'sparks', 'sparkl']

/**
 * Validates a Spark address.
 * A Spark address can be a native Bech32m encoded address or a standard
 * Bitcoin address for L1 deposits.
 *
 * @param {string} address The address to validate.
 * @returns {SparkAddressValidationResult}
 */
export function validateSparkAddress (address) {
  if (address == null || typeof address !== 'string') {
    return { success: false, reason: 'INVALID_FORMAT' }
  }

  const trimmed = address.trim()
  if (trimmed.length === 0) {
    return { success: false, reason: 'EMPTY_ADDRESS' }
  }

  const lower = trimmed.toLowerCase()
  const upper = trimmed.toUpperCase()
  if (trimmed !== lower && trimmed !== upper) {
    return { success: false, reason: 'MIXED_CASE' }
  }

  let decoded
  try {
    decoded = bech32m.decode(lower)
  } catch (e) {
    if (validateBitcoinAddress(trimmed).success) {
      return { success: true, type: 'btc' }
    }

    return { success: false, reason: 'INVALID_FORMAT' }
  }

  if (VALID_PREFIXES.includes(decoded.prefix)) {
    return { success: true, type: 'spark' }
  }

  if (validateBitcoinAddress(trimmed).success) {
    return { success: true, type: 'btc' }
  }

  return { success: false, reason: 'INVALID_FORMAT' }
}
