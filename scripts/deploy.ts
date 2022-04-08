import { ethers, run } from 'hardhat'
import setMerkleTreeRoot from './setMerkleTreeRoot'

async function deployContract() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const dosuInvites = await DosuInvites.deploy()

  await dosuInvites.deployed()

  const address = dosuInvites.address

  console.log('DosuInvites deployed to:', address)

  console.log('Wait for 1 minute')
  await new Promise((resolve) => setTimeout(resolve, 60000))

  await run('verify:verify', {
    address,
  })

  console.log('DosuInvites verified')

  setMerkleTreeRoot(address)
}

deployContract().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
