import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying HelloEthernaut contract...');

  const helloEthernaut = await ethers.deployContract('HelloEthernaut', ['ethernaut0']);

  await helloEthernaut.waitForDeployment();

  const address = await helloEthernaut.getAddress();

  console.log(`HelloEthernaut contract has been successfully deployed to ${address}!`);

  return address;
}

export default main;
