# invites.dosu.io contract code

> The last version of the contract is [deployed here](https://mumbai.polygonscan.com/address/0x854091896472Fb4caf23A9BA5C1Ef3F89b7f98d7#code)

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/dosu-invites-contract`
2. Run `yarn` in the root folder
3. Setup the [polygon api project][polygonscanapi]
4. Create `.env` with the environment variables listed below
5. Run `yarn deploy` to deploy the contract. Please notice, that this costs test money, which you can get at the [faucet](https://faucet.polygon.technology/)
6. Wait until contract creation and verification are finished
7. `setBaseURI` of the contract on the polygonscan to use the IPNS network (take `baseURI` from the `dosu-invites-backend`, it should look like `/ipns/<hash>`)
   - To do so, need to connect the MetaMask to the polygonscan network
     Use this data:
   ```
   Name: Mumbai
   Token: MATIC Token
   RPC: https://rpc-mumbai.matic.today
   chainId: 80001
   ```

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                   | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `POLYGON_SCAN_API_KEY` | You can get one [on polygonscan][polygonscanapi]               |
| `POLYGON_URL`          | You can use [Infura][infura] to setup the polygon project      |
| `PRIVATE_KEY`          | Key of the account which will send the deployment transaction. |

Also, please, consider looking at `.env.sample`.

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

[polygonscanapi]: https://polygonscan.com/myapikey
[infura]: https://infura.io/
