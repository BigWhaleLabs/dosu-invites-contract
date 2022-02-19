/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { DosuInvites } from '../typechain/DosuInvites'
import { addressToString } from './helpers'

const URI_MOCK =
  '/ipns/k51qzi5uqu5dlsba4u2pf5z1il1vx7oy6kf6k84dqsj021854wfsuo5825xtzf'

describe('DosuInvites', function () {
  let signer: SignerWithAddress
  let signerAddress: string
  let dosuInvites: DosuInvites

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    signer = signers[1]
    signerAddress = signer.address

    const DosuInvite = await ethers.getContractFactory('DosuInvites')
    dosuInvites = await DosuInvite.deploy()
    await dosuInvites.deployed()
  })

  it('Should mint an invite', async function () {
    await dosuInvites.allowlistAddress(signerAddress)
    await dosuInvites.mint(signerAddress)

    const signerBalance = await dosuInvites.balanceOf(signerAddress)

    expect(signerBalance.toString()).to.equal('1')
  })

  it('Should return a valid tokenURI', async () => {
    await dosuInvites.setBaseURI(URI_MOCK)
    await dosuInvites.allowlistAddress(signerAddress)
    await dosuInvites.mint(signerAddress)

    const baseURI = await dosuInvites.baseURI()
    const tokenURI = await dosuInvites.tokenURI(0)
    const address = addressToString(+signerAddress)

    // /ipns/<hash>/{tokenId}-{ethAddress}.png
    const expectedURI = `${baseURI}/{TOKEN_ID}-${address}.png`

    expect(tokenURI).to.equal(expectedURI)
  })

  it('Should revert mint execution with allowlist exeption', async function () {
    await expect(dosuInvites.mint(signerAddress)).to.be.revertedWith(
      'This address is not allowlisted'
    )
  })

  it('Should revert execution with exeption', async function () {
    await dosuInvites.allowlistAddress(signerAddress)
    await dosuInvites.mint(signerAddress)
    await expect(dosuInvites.mint(signer.address)).to.be.revertedWith(
      "VM Exception while processing transaction: reverted with reason string 'This address already has an invite'"
    )
  })
})
