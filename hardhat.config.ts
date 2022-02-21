import * as dotenv from 'dotenv'
import { cleanEnv, bool, str } from 'envalid'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

const { PRIVATE_KEY, ETHERSCAN_API_KEY, ROPSTEN_URL, REPORT_GAS } = cleanEnv(
  process.env,
  {
    PRIVATE_KEY: str(),
    ROPSTEN_URL: str(),
    ETHERSCAN_API_KEY: str(),
    REPORT_GAS: bool({ default: true }),
  }
)

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    ropsten: {
      url: ROPSTEN_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'typechain',
  },
}

export default config
