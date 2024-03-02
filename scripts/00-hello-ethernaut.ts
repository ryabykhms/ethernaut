import { ethers } from 'hardhat';
import deployContract from '../deploy/00-hello-ethernaut';

async function main() {
  console.log('Passing HelloEthernaut challenge...');

  const address = await deployContract();
  const contract = await ethers.getContractAt('HelloEthernaut', address);

  const info = await contract.info();
  console.log(info);

  const info1 = await contract.info1();
  console.log(info1);

  const info2 = await contract.info2('hello');
  console.log(info2);

  const infoNum = await contract.infoNum();
  console.log(infoNum);

  const info42 = await contract.info42();
  console.log(info42);

  const theMethodName = await contract.theMethodName();
  console.log(theMethodName);

  const method7123949 = await contract.method7123949();
  console.log(method7123949);

  const password = await contract.password();
  console.log(password);

  await contract.authenticate(password);

  console.log('Well done, You have completed this level!!!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
