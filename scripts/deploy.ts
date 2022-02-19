import { ethers, run } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const dosuInvites = await DosuInvites.deploy()

  await dosuInvites.deployed()

  console.log('DosuInvites deployed to:', dosuInvites.address)

  console.log('Wait for 1 minute')
  await new Promise((resolve) => setTimeout(resolve, 60000))

  await run('verify:verify', {
    address: dosuInvites.address,
  })

  console.log('DosuInvites verified')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
