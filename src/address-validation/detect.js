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

import { validateEVMAddress } from './evm.js'
import { validateBitcoinAddress } from './bitcoin.js'
import { validateSparkAddress } from './spark.js'
import { validateLightningInvoice, validateLnurl, validateLightningAddress } from './lightning.js'
import { validateUmaAddress } from './uma.js'

const PLAIN_USERNAME_REGEX = /^[a-zA-Z0-9._-]{1,50}$/

const PREFIX_ROUTES = [
  {
    test: (a) => a.startsWith('0x'),
    type: 'evm',
    validate: validateEVMAddress
  },
  {
    test: (a) => a.toLowerCase().startsWith('lnurl1'),
    type: 'lnurl',
    validate: validateLnurl
  },
  {
    test: (a) => /^ln(bc|tb|bcrt|sb)/i.test(a),
    type: 'lightning-invoice',
    validate: validateLightningInvoice
  },
  {
    test: (a) => /^spark(rt|t|s|l)?1/i.test(a),
    type: 'spark',
    validate: validateSparkAddress
  },
  {
    test: (a) => /^(bc|tb|bcrt)1/i.test(a),
    type: 'bitcoin',
    validate: validateBitcoinAddress
  },
  {
    test: (a) => /^[13][a-km-zA-HJ-NP-Z1-9]/.test(a),
    type: 'bitcoin',
    validate: validateBitcoinAddress
  },
  {
    test: (a) => a.startsWith('$') && a.includes('@'),
    type: 'uma',
    validate: validateUmaAddress
  },
  {
    test: (a) => a.includes('@') && a.includes('.'),
    type: 'lightning-address',
    validate: validateLightningAddress
  },
  {
    test: (a) => PLAIN_USERNAME_REGEX.test(a),
    type: 'username',
    validate: null
  }
]

export function isPlainUsername (address) {
  return typeof address === 'string' && PLAIN_USERNAME_REGEX.test(address)
}

export function detectAddressType (address) {
  if (!address || typeof address !== 'string') return 'unknown'

  const trimmed = address.trim()
  if (!trimmed) return 'unknown'

  for (const route of PREFIX_ROUTES) {
    if (route.test(trimmed)) {
      if (!route.validate) return route.type
      return route.validate(trimmed).success ? route.type : 'unknown'
    }
  }

  return 'unknown'
}

export function isValidRecipient (address) {
  return detectAddressType(address) !== 'unknown'
}
