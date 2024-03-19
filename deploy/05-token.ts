import { rm } from 'fs/promises';
import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { resolve } from 'path';

const INSTANCE_CONTRACT_NAME = 'Token';

const removePreviousDeployment = async (contractName: string) => {
  try {
    console.log('Removing a previous deployment...');
    await rm(resolve('deployments', 'hardhat', `${contractName}.json`));
  } catch {}
};

async function main() {
  console.log(`Deploying ${INSTANCE_CONTRACT_NAME} contract...`);

  await removePreviousDeployment(INSTANCE_CONTRACT_NAME);

  const { deploy } = deployments;
  const { deployer: deployerAddress, hacker } = await getNamedAccounts();

  const initialSupply = ethers.parseEther('1');

  const contract = await deploy(INSTANCE_CONTRACT_NAME, {
    from: deployerAddress,
    args: [initialSupply],
    log: true,
    waitConfirmations: 1,
  });

  console.log(
    `${INSTANCE_CONTRACT_NAME} contract has been successfully deployed to ${contract.address} with initial supply is ${initialSupply}!`,
  );

  const initialTransferAmount = 20n;

  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contract.address);
  await contractInstance.transfer(hacker, initialTransferAmount);

  console.log(`Sending ${initialTransferAmount} tokens to address of potential hacker...`);

  return contract.address;
}

export default main;
