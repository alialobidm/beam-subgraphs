/**
 * Beam Testnet Config
 */
import { BigDecimal } from '@graphprotocol/graph-ts/index'

export const FACTORY_ADDRESS = '0xB519520A9163dEf547c77892A91c83E9e66e8762'

export const WETH_ADDRESS = '0x3a0c2ba54d6cbd3121f01b96dfd20e99d1696c9d'
export const USDC_WETH_PAIR = '0x0000000000000000000000000000000000000001'
export const USDT_WETH_PAIR = '0x0000000000000000000000000000000000000B0b'
export const DAI_WETH_PAIR = '0x000000000000000000000000000000000000bEEF'

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  '0x3a0c2ba54d6cbd3121f01b96dfd20e99d1696c9d', // WIMX
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('100')

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

// rebass tokens, dont count in tracked volume
export const UNTRACKED_PAIRS: string[] = []

// we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
export const SKIP_TOTAL_SUPPLY: string[] = []
