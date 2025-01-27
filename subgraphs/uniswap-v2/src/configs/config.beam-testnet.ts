/**
 * Beam Testnet Config
 */
import { BigDecimal } from '@graphprotocol/graph-ts/index'

export const FACTORY_ADDRESS = '0xfABa62a3B12f7c29F21881F5ed4c56cb6d45E4fb'

export const WETH_ADDRESS = '0xF65B6f9c94187276C7d91F4F74134751d248bFeA'
export const USDC_WETH_PAIR = '0xA9EA3e595E5b8D0fF3aa4fA3A488ee44d39E357a'
export const USDT_WETH_PAIR = '0xF5C0a13a53D7216fced72Be56253b083240b27db'
export const DAI_WETH_PAIR = '0x000000000000000000000000000000000000bEEF'

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  '0xF65B6f9c94187276C7d91F4F74134751d248bFeA', // WMC
  '0x007Fdc86FD12924C9116025C7F594843087397E3', // USDC
  '0x29633Cf4FF2D98347895C7327f83Ab4cd592C808', // USDT
  '0x2CC787Ed364600B0222361C4188308Fa8E68bA60' // AVAX
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('100')

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

// rebass tokens, dont count in tracked volume
export const UNTRACKED_PAIRS: string[] = []

// we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
export const SKIP_TOTAL_SUPPLY: string[] = []
