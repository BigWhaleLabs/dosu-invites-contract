import { expect } from 'chai'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { MerkleTree } from 'merkletreejs'
import { Contract, utils } from 'ethers'

const ZERO_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

describe('DosuInvites', async function () {
  let contract: Contract
  let contractAsOwner: Contract

  let accounts: SignerWithAddress[]
  let leafNodes: string[]
  let user1: SignerWithAddress
  let owner: SignerWithAddress

  let whitelistTree: MerkleTree

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    user1 = accounts[0]
    owner = accounts[1]

    const factory = await ethers.getContractFactory('DosuInvites')
    contract = await factory.deploy()
    await contract.deployed()

    await (await contract.transferOwnership(owner.address)).wait()
    contractAsOwner = contract.connect(owner)
    await contract.deployed()

    leafNodes = accounts.map((a: SignerWithAddress) =>
      utils.keccak256(a.address)
    )
    whitelistTree = new MerkleTree(leafNodes, utils.keccak256, {
      sortLeaves: true,
    })
  })

  it('setMerkleTreeRoot', async () => {
    await contractAsOwner.setAllowlistMerkleRoot(whitelistTree.getHexRoot())
  })

  // it('setBaseURI', async () => {
  //   await contractAsOwner.setBaseURI(URI_MOCK)
  //   expect(await contractAsOwner.baseURI()).to.equal(URI_MOCK)
  // })

  describe('whitelist minting', async () => {
    beforeEach(async () => {
      await contractAsOwner.setAllowlistMerkleRoot(whitelistTree.getHexRoot())
    })
    it('succesfully whitelist minting', async () => {
      const contractAsAccount0 = contract.connect(user1)
      await contractAsAccount0.mint(whitelistTree.getHexProof(leafNodes[0]))
      const userBalance = await contract.balanceOf(user1.address)

      expect(userBalance).to.equal('1')
    })
    it('cannot mint if Merkle root is not set', async function () {
      await contractAsOwner.setAllowlistMerkleRoot(ZERO_BYTES)
      await expect(
        contract.mint(whitelistTree.getHexProof(leafNodes[0]))
      ).to.be.revertedWith('Merkle proof verification failed')
    })
    it('cannot mint if Merkle root is set to the root of a different tree', async function () {
      const leafNodes = accounts
        .slice(4, 6)
        .map((a: SignerWithAddress) => utils.keccak256(a.address))
      const newTree = new MerkleTree(leafNodes, utils.keccak256, {
        sortLeaves: true,
      })

      await contractAsOwner.setAllowlistMerkleRoot(newTree.getHexRoot())
      await expect(
        contract.mint(whitelistTree.getHexProof(leafNodes[0]))
      ).to.be.revertedWith('Merkle proof verification failed')
    })
    it('cannot mint with a proof that does not match the sender', async function () {
      const contractAsAccount1 = contract.connect(accounts[1])
      const proof = whitelistTree.getHexProof(leafNodes[0])

      await expect(contractAsAccount1.mint(proof)).to.be.revertedWith(
        'Merkle proof verification failed'
      )
    })
  })
})
