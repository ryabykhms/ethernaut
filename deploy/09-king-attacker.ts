import { rm } from 'fs/promises';
import { deployments, getNamedAccounts } from 'hardhat';
import { resolve } from 'path';

const INSTANCE_CONTRACT_NAME = 'KingAttacker';

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
  const { hacker: hackerAddress } = await getNamedAccounts();

  const king = await get('King');

  const contract = await deploy(INSTANCE_CONTRACT_NAME, {
    from: hackerAddress,
    args: [king.address],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`${INSTANCE_CONTRACT_NAME} contract has been successfully deployed to ${contract.address}!`);

  return contract.address;
}

export default main;
