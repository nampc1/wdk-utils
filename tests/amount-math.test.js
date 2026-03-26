import {
  formatFiatAmount,
  parseToSmallest,
  formatSmallest,
  formatSmallestTrimmed,

  parseFiatFromDisplay,
  parseBtcFromSubAmount,
  currencyToSmallest,
  smallestToCurrency
} from '../src/amount-math/index.js'

describe('amount-math', () => {
  // ─── formatFiatAmount ──────────────────────────────────────────────────────

  describe('formatFiatAmount', () => {
    it('formats whole number', () => {
      expect(formatFiatAmount('1234')).toBe('$1,234.00')
    })

    it('formats decimal amount', () => {
      expect(formatFiatAmount('1234.5')).toBe('$1,234.50')
    })

    it('formats zero', () => {
      expect(formatFiatAmount('0')).toBe('$0.00')
    })

    it('shows <$0.01 for tiny positive amounts', () => {
      expect(formatFiatAmount('0.001')).toBe('<$0.01')
      expect(formatFiatAmount('0.009')).toBe('<$0.01')
      expect(formatFiatAmount('0.0099')).toBe('<$0.01')
    })

    it('formats exactly $0.01', () => {
      expect(formatFiatAmount('0.01')).toBe('$0.01')
    })

    it('returns non-numeric input unchanged', () => {
      expect(formatFiatAmount('abc')).toBe('abc')
      expect(formatFiatAmount('')).toBe('')
    })

    it('formats large amounts with commas', () => {
      expect(formatFiatAmount('1000000')).toBe('$1,000,000.00')
    })
  })

  // ─── parseToSmallest ───────────────────────────────────────────────────────

  describe('parseToSmallest', () => {
    it('parses integer string', () => {
      expect(parseToSmallest('1', 6)).toBe(1000000n)
    })

    it('parses decimal string', () => {
      expect(parseToSmallest('1.5', 6)).toBe(1500000n)
    })

    it('pads short fractional part', () => {
      expect(parseToSmallest('1.5', 8)).toBe(150000000n)
    })

    it('truncates extra fractional digits', () => {
      expect(parseToSmallest('1.123456789', 6)).toBe(1123456n)
    })

    it('returns 0n for empty string', () => {
      expect(parseToSmallest('', 6)).toBe(0n)
    })

    it('returns 0n for "0"', () => {
      expect(parseToSmallest('0', 6)).toBe(0n)
    })

    it('parses "0.001" with 8 decimals', () => {
      expect(parseToSmallest('0.001', 8)).toBe(100000n)
    })

    it('parses with 0 decimals', () => {
      expect(parseToSmallest('42', 0)).toBe(42n)
    })

    it('handles large amounts', () => {
      expect(parseToSmallest('21000000', 8)).toBe(2100000000000000n)
    })
  })

  // ─── formatSmallest ────────────────────────────────────────────────────────

  describe('formatSmallest', () => {
    it('formats with full decimal places', () => {
      expect(formatSmallest(1500000n, 6)).toBe('1.500000')
    })

    it('pads small amounts with leading zeros', () => {
      expect(formatSmallest(1n, 6)).toBe('0.000001')
    })

    it('handles 0 decimals', () => {
      expect(formatSmallest(42n, 0)).toBe('42')
    })

    it('formats zero', () => {
      expect(formatSmallest(0n, 6)).toBe('0.000000')
    })

    it('formats BTC amount (8 decimals)', () => {
      expect(formatSmallest(100000n, 8)).toBe('0.00100000')
    })
  })

  // ─── formatSmallestTrimmed ─────────────────────────────────────────────────

  describe('formatSmallestTrimmed', () => {
    it('trims trailing zeros', () => {
      expect(formatSmallestTrimmed(1500000n, 6)).toBe('1.5')
    })

    it('trims all fractional zeros', () => {
      expect(formatSmallestTrimmed(1000000n, 6)).toBe('1')
    })

    it('returns "0" for zero amount', () => {
      expect(formatSmallestTrimmed(0n, 6)).toBe('0')
    })

    it('keeps significant fractional digits', () => {
      expect(formatSmallestTrimmed(100000n, 8)).toBe('0.001')
    })

    it('handles smallest unit', () => {
      expect(formatSmallestTrimmed(1n, 8)).toBe('0.00000001')
    })
  })

// ─── parseFiatFromDisplay ──────────────────────────────────────────────────

  describe('parseFiatFromDisplay', () => {
    it('parses formatted fiat string', () => {
      expect(parseFiatFromDisplay('$1,234.56')).toBe(1234.56)
    })

    it('parses simple amount', () => {
      expect(parseFiatFromDisplay('$100')).toBe(100)
    })

    it('returns null for missing $', () => {
      expect(parseFiatFromDisplay('1234.56')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(parseFiatFromDisplay('')).toBeNull()
    })

    it('returns null for invalid number after $', () => {
      expect(parseFiatFromDisplay('$abc')).toBeNull()
    })

    it('handles whitespace', () => {
      expect(parseFiatFromDisplay('  $50.00  ')).toBe(50)
    })

    it('parses zero', () => {
      expect(parseFiatFromDisplay('$0.00')).toBe(0)
    })
  })

  // ─── parseBtcFromSubAmount ─────────────────────────────────────────────────

  describe('parseBtcFromSubAmount', () => {
    it('parses BTC amount string', () => {
      expect(parseBtcFromSubAmount('0.00123456 BTC')).toBe(0.00123456)
    })

    it('parses without space before BTC', () => {
      expect(parseBtcFromSubAmount('1.5BTC')).toBe(1.5)
    })

    it('is case-insensitive', () => {
      expect(parseBtcFromSubAmount('0.5 btc')).toBe(0.5)
    })

    it('returns null for missing BTC suffix', () => {
      expect(parseBtcFromSubAmount('0.5')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(parseBtcFromSubAmount('')).toBeNull()
    })

    it('returns null for non-numeric', () => {
      expect(parseBtcFromSubAmount('abc BTC')).toBeNull()
    })

    it('handles whitespace', () => {
      expect(parseBtcFromSubAmount('  0.001 BTC  ')).toBe(0.001)
    })
  })

  // ─── currencyToSmallest ────────────────────────────────────────────────────

  describe('currencyToSmallest', () => {
    it('converts $1 USDT at $1 price (6 decimals)', () => {
      expect(currencyToSmallest('1.00', 1.0, 6)).toBe(1000000n)
    })

    it('converts $100 BTC at $50000 price (8 decimals)', () => {
      expect(currencyToSmallest('100.00', 50000, 8)).toBe(200000n)
    })

    it('returns 0n for zero price', () => {
      expect(currencyToSmallest('100', 0, 8)).toBe(0n)
    })

    it('returns 0n for negative price', () => {
      expect(currencyToSmallest('100', -1, 8)).toBe(0n)
    })

    it('converts $0.01 USDT at $1 price', () => {
      expect(currencyToSmallest('0.01', 1.0, 6)).toBe(10000n)
    })

    it('handles large USD amounts', () => {
      const result = currencyToSmallest('1000000', 1.0, 6)
      expect(result).toBe(1000000000000n)
    })
  })

  // ─── smallestToCurrency ────────────────────────────────────────────────────

  describe('smallestToCurrency', () => {
    it('converts 1 USDT to $1 at $1 price', () => {
      expect(smallestToCurrency(1000000n, 6, 1.0)).toBe(1)
    })

    it('returns 0 for zero amount', () => {
      expect(smallestToCurrency(0n, 6, 1.0)).toBe(0)
    })

    it('returns 0 for zero price', () => {
      expect(smallestToCurrency(1000000n, 6, 0)).toBe(0)
    })

    it('returns 0 for negative price', () => {
      expect(smallestToCurrency(1000000n, 6, -5)).toBe(0)
    })

    it('converts BTC smallest to USD', () => {
      // 0.002 BTC at $50000 = $100
      const result = smallestToCurrency(200000n, 8, 50000)
      expect(result).toBe(100)
    })

    it('converts small amounts', () => {
      // 10000 satoshi-equivalent USDT = $0.01 at $1
      const result = smallestToCurrency(10000n, 6, 1.0)
      expect(result).toBe(0.01)
    })
  })

  // ─── Round-trip consistency ────────────────────────────────────────────────

  describe('round-trip', () => {
    it('parseToSmallest → formatSmallestTrimmed preserves value', () => {
      const input = '1.5'
      const smallest = parseToSmallest(input, 6)
      expect(formatSmallestTrimmed(smallest, 6)).toBe(input)
    })

    it('parseToSmallest → formatSmallest preserves full precision', () => {
      const smallest = parseToSmallest('0.001', 8)
      expect(formatSmallest(smallest, 8)).toBe('0.00100000')
    })

    it('currency conversion round-trip is consistent', () => {
      const price = 50000
      const usd = '100.00'
      const smallest = currencyToSmallest(usd, price, 8)
      const backToUsd = smallestToCurrency(smallest, 8, price)
      expect(backToUsd).toBe(100)
    })
  })
})
