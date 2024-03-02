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
