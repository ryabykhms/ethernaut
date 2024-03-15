import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/03-coin-flip';
import deployContractAttack from '../deploy/03-coin-flip-attack';

const INSTANCE_CONTRACT_NAME = 'CoinFlip';
const ATTACK_CONTRACT_NAME = 'CoinFlipAttack';

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(hacker);

  const contractAttackAddress = await deployContractAttack();
  const contractAttackInstance = await ethers.getContractAt(ATTACK_CONTRACT_NAME, contractAttackAddress);
  const contractAttack = contractAttackInstance.connect(hacker);

  const initialConsecutiveWins = await contract.consecutiveWins();
  console.log('Initial Consecutive Wins', initialConsecutiveWins);

  for (let i = 0; i < 10; i++) {
    await contractAttack.attack();
  }

  const consecutiveWins = await contract.consecutiveWins();
  console.log('Result Consecutive Wins', consecutiveWins);

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
