import { ContractReceipt, ContractTransaction } from 'ethers'
import { ethers } from 'hardhat'

async function main() {
  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error('Missing required env var CONTRACT_ADDRESS')
  }
  const contractAddress = process.env.CONTRACT_ADDRESS
  if (!process.env.MERKLE_ROOT) {
    throw new Error('Missing required env var MERKLE_ROOT')
  }
  const merkleRoot = process.env.MERKLE_ROOT

  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const contract = await DosuInvites.attach(contractAddress)
  await wait(contract.setMerkleRoot(merkleRoot))
  console.log(`Merkle root updated: ${merkleRoot}`)
}

async function wait(
  tx: ContractTransaction | Promise<ContractTransaction>
): Promise<ContractReceipt> {
  return (await tx).wait()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
