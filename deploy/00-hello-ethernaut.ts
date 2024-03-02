import { deployments, getNamedAccounts } from 'hardhat';

async function main() {
  console.log('Deploying HelloEthernaut contract...');

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ['ethernaut0'];

  const helloEthernaut = await deploy('HelloEthernaut', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: 1,
  });

  console.log(`HelloEthernaut contract has been successfully deployed to ${helloEthernaut.address}!`);

  return helloEthernaut.address;
}

export default main;
