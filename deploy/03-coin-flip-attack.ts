import { rm } from 'fs/promises';
import { deployments, getNamedAccounts } from 'hardhat';
import { resolve } from 'path';

const INSTANCE_CONTRACT_NAME = 'CoinFlipAttack';

const removePreviousDeployment = async (contractName: string) => {
  try {
    console.log('Removing a previous deployment...');
    await rm(resolve('deployments', 'hardhat', `${contractName}.json`));
  } catch {}
};

async function main() {
  console.log(`Deploying ${INSTANCE_CONTRACT_NAME} contract...`);

  await removePreviousDeployment(INSTANCE_CONTRACT_NAME);

  const { deploy, get } = deployments;
  const { deployer: deployerAddress } = await getNamedAccounts();

  const coinFlip = await get('CoinFlip');

  const contract = await deploy(INSTANCE_CONTRACT_NAME, {
    from: deployerAddress,
    args: [coinFlip.address],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`${INSTANCE_CONTRACT_NAME} contract has been successfully deployed to ${contract.address}!`);

  return contract.address;
}

export default main;
