import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const DosuInvite = await ethers.getContractFactory('DosuInvite');
  const dosuInvite = await DosuInvite.deploy();

  await dosuInvite.deployed();

  console.log('DosuInvite deployed to:', dosuInvite.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
