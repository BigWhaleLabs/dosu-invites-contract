import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const DosuInvite = await ethers.getContractFactory('DosuInvite');
  const dosuInvite = await DosuInvite.deploy(
    '0xbf74483DB914192bb0a9577f3d8Fb29a6d4c08eE',
    5,
    1000
  );

  await dosuInvite.deployed();

  console.log('StreetCred deployed to:', dosuInvite.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
