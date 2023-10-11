/**
 * Beam Mainnet Config
 */
import { BigDecimal } from '@graphprotocol/graph-ts/index'

export const FACTORY_ADDRESS = '0x662b526FB70EBB508962f3f61c9F735f687C8fA5'

export const WETH_ADDRESS = '0xD51BFa777609213A653a2CD067c9A0132a2D316A'
export const USDC_WETH_PAIR = '0xe510c67dd0A54D06f04fd5af9094fe64Ed605EaB'
export const USDT_WETH_PAIR = '0x0000000000000000000000000000000000000B0b'
export const DAI_WETH_PAIR = '0x000000000000000000000000000000000000bEEF'

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  '0xD51BFa777609213A653a2CD067c9A0132a2D316A', // WMC
  '0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304', // USDC
  '0x999f90f25a2922ae1b21A06066F7EDEbedad42a9', // USDT
  '0x00E69e0b6014d77040b28E04F2b8ac25A6EA5d34', // AVAX
  '0xe338aA35D844D5C1a4E052380DBFA939e0cce13F' // RST
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('100')

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

// rebass tokens, dont count in tracked volume
export const UNTRACKED_PAIRS: string[] = []

// we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
export const SKIP_TOTAL_SUPPLY: string[] = []
