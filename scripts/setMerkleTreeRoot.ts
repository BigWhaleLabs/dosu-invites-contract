import { ethers } from 'hardhat'
import fs from 'fs'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import { ContractReceipt, ContractTransaction } from 'ethers'

function generateMerkleTree(data: Array<string>): MerkleTree {
  const leafNodes = data.map((addr) => keccak256(addr))
  return new MerkleTree(leafNodes, keccak256, { sortPairs: true })
}

const OUT_FILE_PATH = 'data/allowlist.json'

export default async function setMerkleTreeRoot(contractAddress?: string) {
  const data = JSON.parse(fs.readFileSync(OUT_FILE_PATH).toString())

  const address =
    contractAddress || '0x399f4a0a9d6E8f6f4BD019340e4d1bE0C9a742F0'

  console.log('\n==== Creating Merkle tree and calculating root... ====')
  const tree = generateMerkleTree(data)
  const root = `0x${tree.getRoot().toString('hex')}`
  console.log(root)
  console.log('==== Complete! ====\n')

  const DosuInvites = await ethers.getContractFactory('DosuInvites')
  const contract = await DosuInvites.attach(address)
  console.log('Setting merkle tree')
  const tx = await contract.setMerkleRoot(root)
  console.log('tx:', tx)
  await tx.wait()
  console.log('Merkle root updated in the contract')
}
