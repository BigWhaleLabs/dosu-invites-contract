# invites.dosu.io contract code

> The last version of the contract is deployed here: https://ropsten.etherscan.io/address/0x37C897117256cA9053965FC9F522e2F05f40AdF1

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/dosu-invites-contract`
2. Run `yarn` in the root folder
3. Setup the [etherscan api project][etherscanapi]
4. Also setup [Alchemy Project][alchemyapps] (Billing information required)
5. Create `.env` with the environment variables listed below
6. With a valid .env file in place, first deploy your contract: `yarn deploy`. Please notice, that this costs test money, which you can get at the [faucet](https://app.mycrypto.com/faucet)
7. Wait until contract creation and code verification are finished
8. `setBaseUri` of the contract on etherscan (take `baseUri` from the `dosu-invites-backend`)

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `ETHERSCAN_API_KEY` | You can get one [on etherscan][etherscanapi]                  |
| `ROPSTEN_URL`       | URL of the node URL (eg from [Alchemy][alchemyapps])          |
| `PRIVATE_KEY`       | Key of the account which will send the deployment transaction |

Also, please, consider looking at `.env.sample`.

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

[alchemyapps]: https://dashboard.alchemyapi.io/apps/
[etherscanapi]: https://etherscan.io/myapikey
