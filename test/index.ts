// @ts-nocheck
import { expect } from 'chai'
import { ethers } from 'hardhat'

// eslint-disable-next-line node/no-missing-import
import { addressToString } from './helpers'

describe('DosuInvite', async function () {
  // eslint-disable-next-line no-unused-vars
  let admin, artist, user1, user2
  let dosuInvite

  const URI_MOCK =
    '/ipns/k51qzi5uqu5dlsba4u2pf5z1il1vx7oy6kf6k84dqsj021854wfsuo5825xtzf'

  beforeEach(async () => {
    ;[admin, artist, user1, user2] = await ethers.getSigners()
    const DosuInvite = await ethers.getContractFactory('DosuInvites')
    dosuInvite = await DosuInvite.deploy()
    await dosuInvite.deployed()
  })

  it('Should set the baseURI', async () => {
    await dosuInvite.setBaseURI(URI_MOCK)
    const baseURI = await dosuInvite.baseURI()

    expect(baseURI).to.equal(URI_MOCK)
  })

  it('Should mint an invite', async function () {
    await dosuInvite.allowlistAddress(user1.address)
    await dosuInvite.mint(user1.address)

    const balanceUser1 = await dosuInvite.balanceOf(user1.address)

    expect(balanceUser1.toString()).to.equal('1')
  })

  it('Should return a valid tokenURI', async () => {
    await dosuInvite.setBaseURI(URI_MOCK)
    await dosuInvite.allowlistAddress(user1.address)
    await dosuInvite.mint(user1.address)

    const TOKEN_ID = 1
    const baseURI = await dosuInvite.baseURI()
    const tokenURI = await dosuInvite.tokenURI(TOKEN_ID)
    const address = addressToString(user1.address)

    // /ipns/<hash>/{tokenId}-{ethAddress}.png
    const expectedURI = `${baseURI}/{TOKEN_ID}-${address}.png`

    expect(tokenURI).to.equal(expectedURI)
  })

  it('Should revert mint execution with allowlist exeption', async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      'This address is not allowlisted'
    )
  })

  it('Should revert execution with exeption', async function () {
    await dosuInvite.allowlistAddress(user1.address)
    await dosuInvite.mint(user1.address)
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      'This address is already have an invite'
    )
  })
})
