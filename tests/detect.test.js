import { isValidRecipient, detectAddressType, isPlainUsername } from '../src/address-validation/detect.js'

describe('detectAddressType', () => {
  // --- EVM ---
  it('detects valid EVM address', () => {
    expect(detectAddressType('0x742d35cc6634c0532925a3b844bc454e4438f44e')).toBe('evm')
  })

  it('returns unknown for invalid EVM address (wrong length)', () => {
    expect(detectAddressType('0x742d35cc')).toBe('unknown')
  })

  // --- Bitcoin ---
  it('detects P2PKH mainnet address', () => {
    expect(detectAddressType('18hnriom5tB5KtFb982m8f9cZz4i72PUpZ')).toBe('bitcoin')
  })

  it('detects P2SH mainnet address', () => {
    expect(detectAddressType('3B92DKafDSgRXACQzJACkUusYKyyrVjKLd')).toBe('bitcoin')
  })

  it('detects bech32 mainnet address', () => {
    expect(detectAddressType('bc1qu9yqnhc6wjj6s62s9x0shnl5l2r7gq5cudm94r7mvwv0uw4s7acq0hn9g6')).toBe('bitcoin')
  })

  it('detects bech32m taproot address', () => {
    expect(detectAddressType('bc1pkf2alvh0q96nyf7yhw2w3x7etlw22sasn2kxu59xzzl2px7ga4asctyc2v')).toBe('bitcoin')
  })

  it('detects testnet bech32 address', () => {
    expect(detectAddressType('tb1qu9yqnhc6wjj6s62s9x0shnl5l2r7gq5cudm94r7mvwv0uw4s7acqcl92j4')).toBe('bitcoin')
  })

  it('detects regtest bech32m address', () => {
    expect(detectAddressType('bcrt1pu9yqnhc6wjj6s62s9x0shnl5l2r7gq5cudm94r7mvwv0uw4s7acql309ln')).toBe('bitcoin')
  })

  // --- Spark ---
  it('detects spark address', () => {
    expect(detectAddressType('spark1pgss82uvuvyjggx72gl42qk3285yz0j6lgxw9uk2mvgajsr8w22nudv8w6hqs2')).toBe('spark')
  })

  it('returns unknown for invalid spark address (bad checksum)', () => {
    expect(detectAddressType('spark1pgssyuuuhnrrdjswal5c3s3rafw9w3y5dd4cjy3duxlf7hjzkp0rqx6dj6mrha')).toBe('unknown')
  })

  // --- Lightning invoice ---
  it('detects lightning invoice', () => {
    const invoice = 'lnbc100u1p5m3k6fpp5uk9rs7fdrvssehzthphfjvpc3t5hyacgrveskwqzwclrdsl0cjgsdqydp5scqzzsxqrrssrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqqqqqyqqqqqqqqqqqqqqqqqqqqqqjqnp4qtem70et4qm86lv449zcpqjn9nmamd6qrzm3wa3d7msnq2kx3yapwsp50c4l2z72hcmejj88en6eu2p8u2ypv87pw5pndzjjtclwaw0f7wds9qyyssqtqeqrvaaw92y7at9463vxhwkjdy7lpxet7h6g4vry8xyw4ar9yn8qq36dryntpf252v58c4hrf4g59z2pr25lhp06n7x4z7yltd022cqk7lc7e'
    expect(detectAddressType(invoice)).toBe('lightning-invoice')
  })

  // --- LNURL ---
  it('detects lnurl', () => {
    const lnurl = 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhxurj093k7mtxdae8gwfjnztwnf'
    expect(detectAddressType(lnurl)).toBe('lnurl')
  })

  it('detects uppercase lnurl', () => {
    const lnurl = 'LNURL1DP68GURN8GHJ7AMPD3KX2AR0VEEKZAR0WD5XJTNRDAKJ7TNHV4KXCTTTDEHHWM30D3H82UNVWQHHXURJ093K7MTXDAE8GWFJNZTWNF'
    expect(detectAddressType(lnurl)).toBe('lnurl')
  })

  // --- UMA ---
  it('detects UMA address with $ prefix', () => {
    expect(detectAddressType('$user@uma.money')).toBe('uma')
  })

  // --- Lightning address ---
  it('detects lightning address', () => {
    expect(detectAddressType('sprycomfort92@walletofsatoshi.com')).toBe('lightning-address')
  })

  it('returns unknown for address without dot in domain', () => {
    expect(detectAddressType('user@localhost')).toBe('unknown')
  })

  // --- Username ---
  it('detects plain username', () => {
    expect(detectAddressType('satoshi')).toBe('username')
    expect(detectAddressType('user.name-123')).toBe('username')
  })

  // --- Unknown / edge cases ---
  it('returns unknown for empty input', () => {
    expect(detectAddressType('')).toBe('unknown')
    expect(detectAddressType(null)).toBe('unknown')
    expect(detectAddressType(undefined)).toBe('unknown')
  })

  it('returns unknown for non-string input', () => {
    expect(detectAddressType(123)).toBe('unknown')
    expect(detectAddressType(true)).toBe('unknown')
    expect(detectAddressType({})).toBe('unknown')
  })

  it('returns unknown for whitespace', () => {
    expect(detectAddressType('   ')).toBe('unknown')
  })

  it('returns unknown for special characters', () => {
    expect(detectAddressType('!!!@@@')).toBe('unknown')
  })

  it('trims whitespace before detecting', () => {
    expect(detectAddressType('  0x742d35cc6634c0532925a3b844bc454e4438f44e  ')).toBe('evm')
  })
})

describe('isValidRecipient', () => {
  it('returns true for valid addresses', () => {
    expect(isValidRecipient('0x742d35cc6634c0532925a3b844bc454e4438f44e')).toBe(true)
    expect(isValidRecipient('bc1pkf2alvh0q96nyf7yhw2w3x7etlw22sasn2kxu59xzzl2px7ga4asctyc2v')).toBe(true)
    expect(isValidRecipient('satoshi')).toBe(true)
  })

  it('returns false for invalid addresses', () => {
    expect(isValidRecipient('')).toBe(false)
    expect(isValidRecipient('0xinvalid')).toBe(false)
    expect(isValidRecipient(null)).toBe(false)
  })
})

describe('isPlainUsername', () => {
  it('returns true for valid usernames', () => {
    expect(isPlainUsername('satoshi')).toBe(true)
    expect(isPlainUsername('user.name')).toBe(true)
    expect(isPlainUsername('user-name_123')).toBe(true)
  })

  it('returns false for non-usernames', () => {
    expect(isPlainUsername('user@domain.com')).toBe(false)
    expect(isPlainUsername('user with spaces')).toBe(false)
    expect(isPlainUsername('')).toBe(false)
    expect(isPlainUsername('a'.repeat(51))).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(isPlainUsername(null)).toBe(false)
    expect(isPlainUsername(undefined)).toBe(false)
    expect(isPlainUsername(123)).toBe(false)
  })
})
