import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { DosuInvites } from '../typechain'

import MerkleTree from '../src/merkleTree'

import { addressToString } from './helpers'

const URI_MOCK =
  'https://ipfs.io/ipfs/QmS9USYMcsLXqCGaeN9sZaSTLoeGuS6NYzGm6QRsGn5Hac'
const MAX_TREE_SIZE_TO_TEST = 9
const ZERO_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

describe('DosuInvites', async function () {
  let contract: DosuInvites
  let contractAsUser: DosuInvites
  let contractAsOwner: DosuInvites

  let accounts: SignerWithAddress[]
  let addrs: string[]
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let owner: SignerWithAddress
  let user1: SignerWithAddress
  let user2: SignerWithAddress

  let whitelistTree: MerkleTree

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    ;[deployer, user, owner, user1, user2] = accounts

    const factory = await ethers.getContractFactory('DosuInvites')
    contract = await factory.deploy()
    await contract.deployed()

    await (await contract.transferOwnership(owner.address)).wait()
    contractAsUser = contract.connect(user)
    contractAsOwner = contract.connect(owner)
    await contract.deployed()

    addrs = accounts.map((a) => a.address)

    whitelistTree = new MerkleTree([addrs[0], addrs[1]])
  })

  it('setMerkleTreeRoot', async () => {
    await contractAsOwner.setMerkleRoot(whitelistTree.getRoot())
  })

  it('setBaseURI', async () => {
    await contractAsOwner.setBaseURI(URI_MOCK)
    expect(await contractAsOwner.baseURI()).to.equal(URI_MOCK)
  })

  describe('whitelist minting', async () => {
    let leaves: any

    before(async () => {
      leaves = [
        addrs[0],
        addrs[1],
        addrs[2],
        addrs[3],
        addrs[4],
        addrs[5],
        addrs[6],
        addrs[7],
        addrs[8],
        addrs[9],
      ]
      if (leaves.length < MAX_TREE_SIZE_TO_TEST) {
        throw new Error('Invalid MAX_TREE_SIZE_TO_TEST')
      }
    })
    beforeEach(async () => {
      await contractAsOwner.setMerkleRoot(whitelistTree.getRoot())
    })
    it('succesfully whitelist minting', async () => {
      const contractAsAccount0 = contract.connect(accounts[0])

      await contractAsAccount0.mint(whitelistTree.getProof(addrs[0]))
      expect(await contract.totalSupply()).to.equal(1)
    })
    it('cannot mint if Merkle root is not set', async function () {
      await contractAsOwner.setMerkleRoot(ZERO_BYTES)
      await expect(
        contract.mint(whitelistTree.getProof(addrs[0]))
      ).to.be.revertedWith('Invalid Merkle proof')
    })
    it('cannot mint if Merkle root is set to the root of a different tree', async function () {
      const newTree = new MerkleTree([addrs[4], addrs[5]])

      await contractAsOwner.setMerkleRoot(newTree.getRoot())
      await expect(
        contract.mint(whitelistTree.getProof(addrs[0]))
      ).to.be.revertedWith('Invalid Merkle proof')
    })
    it('cannot mint with a proof that does not match the sender', async function () {
      const contractAsAccount1 = contract.connect(accounts[1])
      const proof = whitelistTree.getProof(addrs[0])

      await expect(contractAsAccount1.mint(proof)).to.be.revertedWith(
        'Invalid Merkle proof'
      )
    })
  })
})
