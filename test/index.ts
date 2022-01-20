// @ts-nocheck
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DosuInvite", async function () {
  let admin, artist, user1, user2;
  let dosuInvite;

  beforeEach(async () => {
    [admin, artist, user1, user2] = await ethers.getSigners();
    const DosuInvite = await ethers.getContractFactory("DosuInvites");
    dosuInvite = await DosuInvite.deploy();
    await dosuInvite.deployed();
  });
  it("Should mint an invite", async function () {
    await dosuInvite.whitelistAddress(user1.address);
    await dosuInvite.mint(user1.address);

    const balanceUser1 = await dosuInvite.balanceOf(user1.address);
    console.log("balanceUser1", balanceUser1.toString());

    expect(balanceUser1.toString()).to.equal("1");
  });

  it("Should set the baseURI", async () => {
    await dosuInvite.setBaseURI(
      "https://ipfs.io/ipfs/QmS9USYMcsLXqCGaeN9sZaSTLoeGuS6NYzGm6QRsGn5Hac"
    );
    await dosuInvite.whitelistAddress(user1.address);
    await dosuInvite.mint(user1.address);
    const owner = await dosuInvite.ownerOf(0);
    console.log("owner", owner);
    const baseURI = await dosuInvite.returnURI();
    console.log("baseURI", baseURI);
  });

  it("Should return tokenURI", async () => {
    await dosuInvite.setBaseURI(
      "https://ipfs.io/ipfs/QmS9USYMcsLXqCGaeN9sZaSTLoeGuS6NYzGm6QRsGn5Hac"
    );
    await dosuInvite.whitelistAddress(user1.address);
    await dosuInvite.mint(user1.address);
    const tokenURI = await dosuInvite.tokenURI(0);
    console.log("tokenURI", tokenURI);
  });

  it("Should revert mint execution with whitelist exeption", async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      "This address is not whitelisted"
    );
  });

  it("Should revert execution with exeption", async function () {
    await expect(dosuInvite.mint(user1.address)).to.be.revertedWith(
      "This address is already have an invite"
    );
  });
});
