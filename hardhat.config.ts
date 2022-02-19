import * as dotenv from 'dotenv'
import { cleanEnv, bool, str } from 'envalid'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

const { PRIVATE_KEY, POLYGON_SCAN_API_KEY, POLYGON_URL, REPORT_GAS } = cleanEnv(
  process.env,
  {
    PRIVATE_KEY: str(),
    POLYGON_URL: str(),
    POLYGON_SCAN_API_KEY: str(),
    REPORT_GAS: bool({ default: true }),
  }
)

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    polygon: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      polygon: POLYGON_SCAN_API_KEY,
      polygonMumbai: POLYGON_SCAN_API_KEY,
    },
  },
  typechain: {
    outDir: 'typechain',
  },
}

export default config
