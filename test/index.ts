// @ts-nocheck
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DosuInvite', async function () {
  let admin, artist, user1, user2;
  let dosuInvite;

  beforeEach(async () => {
    [admin, artist, user1, user2] = await ethers.getSigners();
    const DosuInvite = await ethers.getContractFactory('DosuInvite');
    dosuInvite = await DosuInvite.deploy();
    await dosuInvite.deployed();
  });

  it('Should revert mint execution with whitelist exeption', async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      'This address is not whitelisted'
    );
  });

  it('Should mint an invite', async function () {
    await dosuInvite.whitelistAddress(user1.address);
    await dosuInvite.mint(user1.address);

    const balanceUser1 = await dosuInvite.balanceOf(user1.address);

    expect(balanceUser1.toString()).to.equal('1');
  });

  it('Should revert execution with exeption', async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      'This address is already have an invite'
    );
  });
});
