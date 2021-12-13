// @ts-nocheck
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DosuInvite', function () {
  let admin, artist, user1, user2;
  let dosuInvite;

  beforeEach(async () => {
    [admin, artist, user1, user2] = await ethers.getSigners();
    const DosuInvite = await ethers.getContractFactory('DosuInvite');
    dosuInvite = await DosuInvite.deploy(
      '0xbf74483DB914192bb0a9577f3d8Fb29a6d4c08eE',
      5,
      1000
    );
    await dosuInvite.deployed();
  });

  it('Should mint an invite', async function () {
    await dosuInvite.mint(user1.address);

    const balanceUser1 = await dosuInvite.balanceOf(user1);

    expect(balanceUser1.toString()).to.equal('1');
  });

  it('Should revert execution with exeption', async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      'This address already have an invite'
    );
  });
});
