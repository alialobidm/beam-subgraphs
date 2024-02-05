/**
 * Beam Testnet Config
 */
import { BigDecimal } from '@graphprotocol/graph-ts/index'

export const FACTORY_ADDRESS = '0x999f90f25a2922ae1b21A06066F7EDEbedad42a9'

export const WETH_ADDRESS = '0x1CcCa691501174B4A623CeDA58cC8f1a76dc3439'
export const USDC_WETH_PAIR = '0x0000000000000000000000000000000000000001'
export const USDT_WETH_PAIR = '0x0000000000000000000000000000000000000B0b'
export const DAI_WETH_PAIR = '0x000000000000000000000000000000000000bEEF'

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  '0x1CcCa691501174B4A623CeDA58cC8f1a76dc3439', // WIMX
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('100')

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

// rebass tokens, dont count in tracked volume
export const UNTRACKED_PAIRS: string[] = []

// we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
export const SKIP_TOTAL_SUPPLY: string[] = []
