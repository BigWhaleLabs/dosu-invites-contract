import { ethers, run } from 'hardhat'

async function deployContract() {
  // Get the contract owner
  const [deployer] = await ethers.getSigners()
  // Deploy the contract
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())
  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const dosuInvites = await DosuInvites.deploy()
  console.log('Deploy tx:', dosuInvites.deployTransaction)
  await dosuInvites.deployed()
  const address = dosuInvites.address
  console.log('Contract deployed to:', address)
  console.log('Wait for 1 minute to make sure blockchain is updated')
  await new Promise((resolve) => setTimeout(resolve, 60 * 1000))
  // Try to verify the contract on Etherscan
  console.log('Verifying contract on Etherscan')
  try {
    await run('verify:verify', {
      address,
    })
  } catch (err) {
    console.log('Error verifiying contract on Etherscan:', err)
  }
  // Print out the information
  console.log('DosuInvites deployed and verified on Etherscan!')
  console.log('Contract address:', address)
  console.log(
    'Etherscan URL:',
    `https://ropsten.etherscan.io/address/${address}`
  )
}

deployContract().catch((error) => {
  console.error('Error deploying the contract:', error)
  process.exitCode = 1
})
