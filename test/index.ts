import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { DosuInvites } from 'typechain'
import { MerkleTree } from 'merkletreejs'

const MAX_TREE_SIZE_TO_TEST = 9
const ZERO_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

describe('DosuInvites', async function () {
  let contract: DosuInvites
  let contractAsOwner: DosuInvites

  let accounts: SignerWithAddress[]
  let addresses: string[]
  let owner: SignerWithAddress

  let whitelistTree: MerkleTree

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[2]

    const factory = await ethers.getContractFactory('DosuInvites')
    contract = await factory.deploy()
    await contract.deployed()

    await (await contract.transferOwnership(owner.address)).wait()
    contractAsOwner = contract.connect(owner)
    await contract.deployed()

    addresses = accounts.map((a) => a.address)

    whitelistTree = new MerkleTree([addresses[0], addresses[1]], undefined, {
      sortPairs: true,
    })
  })

  it('setMerkleTreeRoot', async () => {
    await contractAsOwner.setAllowlistMerkleRoot(whitelistTree.getRoot())
  })

  // it('setBaseURI', async () => {
  //   await contractAsOwner.setBaseURI(URI_MOCK)
  //   expect(await contractAsOwner.baseURI()).to.equal(URI_MOCK)
  // })

  describe('whitelist minting', async () => {
    let leaves: any

    before(async () => {
      leaves = [
        addresses[0],
        addresses[1],
        addresses[2],
        addresses[3],
        addresses[4],
        addresses[5],
        addresses[6],
        addresses[7],
        addresses[8],
        addresses[9],
      ]
      if (leaves.length < MAX_TREE_SIZE_TO_TEST) {
        throw new Error('Invalid MAX_TREE_SIZE_TO_TEST')
      }
    })
    beforeEach(async () => {
      await contractAsOwner.setAllowlistMerkleRoot(whitelistTree.getRoot())
    })
    it('succesfully whitelist minting', async () => {
      const contractAsAccount0 = contract.connect(accounts[0])

      await contractAsAccount0.mint(whitelistTree.getHexProof(addresses[0]))
      expect(await contract.totalSupply()).to.equal(1)
    })
    it('cannot mint if Merkle root is not set', async function () {
      await contractAsOwner.setAllowlistMerkleRoot(ZERO_BYTES)
      await expect(
        contract.mint(whitelistTree.getProof(addresses[0]))
      ).to.be.revertedWith('Invalid Merkle proof')
    })
    it('cannot mint if Merkle root is set to the root of a different tree', async function () {
      const newTree = new MerkleTree([addresses[4], addresses[5]])

      await contractAsOwner.setAllowlistMerkleRoot(newTree.getRoot())
      await expect(
        contract.mint(whitelistTree.getProof(addresses[0]))
      ).to.be.revertedWith('Invalid Merkle proof')
    })
    it('cannot mint with a proof that does not match the sender', async function () {
      const contractAsAccount1 = contract.connect(accounts[1])
      const proof = whitelistTree.getProof(addresses[0])

      await expect(contractAsAccount1.mint(proof)).to.be.revertedWith(
        'Invalid Merkle proof'
      )
    })
  })
})
