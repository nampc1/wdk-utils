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


/**
 * formatFiatAmount
 * Returns.
 * @param {string} value
 * @returns {string}
 */

export function formatFiatAmount(value) {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  if (num > 0 && num < 0.01) return '<$0.01'
  return (
    '$' +
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  )
}

/**
 * parseToSmallest
 * @param {string} str
 * @param {number} decimals
 * @returns {bigint}
 */

export function parseToSmallest(str, decimals) {
  if (!str || str === '0') return 0n
  const [intStr, fracStr = ''] = str.split('.')
  const fracPadded = fracStr.padEnd(decimals, '0').slice(0, decimals)
  return (
    BigInt(intStr || '0') * 10n ** BigInt(decimals) + BigInt(fracPadded || '0')
  )
}

/**
 * formatSmallest
 * @param {bigint} amount
 * @param {number} decimals
 * @returns {string}
 */

export function formatSmallest(amount, decimals) {
  if (decimals === 0) return amount.toString()
  const s = amount.toString().padStart(decimals + 1, '0')
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`
}

/**
 * formatSmallestTrimmed
 * @param {bigint} amount
 * @param {number} decimals
 * @returns {string}
 */

export function formatSmallestTrimmed(
  amount,
  decimals
) {
  if (amount === 0n) return '0'
  return formatSmallest(amount, decimals).replace(/\.?0+$/, '') || '0'
}


/**
 * parseFiatFromDisplay
 * @param {string} value
 * @returns {number | null}
 */


export function parseFiatFromDisplay(value) {
  const trimmed = value.trim()
  if (!trimmed.startsWith('$')) return null
  const numeric = trimmed.slice(1).replace(/,/g, '')
  const n = Number(numeric)
  return Number.isFinite(n) ? n : null
}

/**
 * parseBtcFromSubAmount
 * @param {string} value
 * @returns {number | null}
 */

export function parseBtcFromSubAmount(value) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([0-9]*\.?[0-9]+)\s*BTC$/i)
  if (!match) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

// ─── Price-based conversion ────────────────────────────────────────────────────
// price: number from market API — acceptable at the boundary only.
// It is immediately scaled to bigint for all internal math.

const PRICE_SCALE = 8

/**
 * currencyToSmallest
 * @param {string} currencyStr
 * @param {number} price
 * @param {number} tokenDecimals
 * @returns {bigint}
 */
export function currencyToSmallest(
  currencyStr,
  price,
  tokenDecimals
) {
  if (price <= 0) return 0n
  const priceBig = BigInt(Math.round(price * 10 ** PRICE_SCALE))
  if (priceBig === 0n) return 0n
  const currencyBig = parseToSmallest(currencyStr, PRICE_SCALE)
  return (currencyBig * 10n ** BigInt(tokenDecimals)) / priceBig
}

/**
 * smallestToCurrency
 * @param {bigint} amount
 * @param {number} tokenDecimals
 * @param {number} price
 * @returns {number}
 */

export function smallestToCurrency(
  amount,
  tokenDecimals,
  price
) {
  if (price <= 0 || amount <= 0n) return 0
  const priceBig = BigInt(Math.round(price * 10 ** PRICE_SCALE))
  const divisor = 10n ** BigInt(tokenDecimals + PRICE_SCALE - 2)
  const centsBig = (amount * priceBig) / divisor
  return Number(centsBig) / 100
}
