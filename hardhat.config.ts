import * as dotenv from 'dotenv'
import { cleanEnv, str, testOnly } from 'envalid'
import { HardhatUserConfig } from 'hardhat/config'
import { ETH_RPC as FALLBACK_ETH_RPC } from '@big-whale-labs/constants'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

const {
  CONTRACT_OWNER_PRIVATE_KEY,
  ETH_RPC,
  ETHERSCAN_API_KEY,
  COINMARKETCAP_API_KEY,
} = cleanEnv(process.env, {
  CONTRACT_OWNER_PRIVATE_KEY: str({
    devDefault: testOnly(
      '0000000000000000000000000000000000000000000000000000000000000000'
    ),
  }),
  ETH_RPC: str({ default: FALLBACK_ETH_RPC }),
  ETHERSCAN_API_KEY: str({ devDefault: testOnly('') }),
  COINMARKETCAP_API_KEY: str({ devDefault: testOnly('') }),
})

const config: HardhatUserConfig = {
  solidity: '0.8.14',
  networks: {
    deploy: {
      url: ETH_RPC,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'typechain',
  },
}

export default config
