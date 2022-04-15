import { ethers, run } from 'hardhat'
import setMerkleTreeRoot from './setMerkleTreeRoot'

async function deployContract() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const dosuInvites = await DosuInvites.deploy()
  console.log('tx:', dosuInvites.deployTransaction)
  await dosuInvites.deployed()

  const address = dosuInvites.address

  console.log('DosuInvites deployed to:', address)

  console.log('Wait for 1 minute')
  await new Promise((resolve) => setTimeout(resolve, 60000))

  try {
    await run('verify:verify', {
      address,
    })
  } catch (err) {
    console.log('Error verifiying contract on etherscan:', err)
  }

  console.log('DosuInvites verified')

  setMerkleTreeRoot(address)
}

deployContract().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
