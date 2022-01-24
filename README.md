# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/dosu-invites-contract`
2. Run `yarn` in the root folder
3. Setup the [etherscan api project][etherscanapi]
4. Also setup [Alchemy Project][alchemyapps] (Billing information required)
5. Create `.env` with the environment variables listed below
6. With a valid .env file in place, first deploy your contract: `yarn deploy`
7. Copy the deployment ETH address
8. Paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
yarn hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

9. Get your address and go to `https://ropsten.etherscan.io/address/{yourAddress}`, wait until contract creation is finished

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                | Description                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETHERSCAN_API_KEY` | You can get one [on etherscan][etherscanapi]                                                                                                |
| `ROPSTEN_URL`       | URL of the node URL (eg from [Alchemy][alchemyapps])                                                                                        |
| `PRIVATE_KEY`       | Key of the account which will send the deployment transaction. You can get one inside the MetaMask -> Account Details -> Export Private Key |

Also, please, consider looking at `.env.sample`.

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

[alchemyapps]: https://dashboard.alchemyapi.io/apps/
[etherscanapi]: https://etherscan.io/myapikey
