// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DosuInvite is ERC721 {

  uint256 constant public TOTAL_SUPPLY = 999;
  uint16 public invitesMinted;
  uint256 private nextId;
    
  constructor()  ERC721("DosuInvite", "DOSU") {}

  function mint() external {
    require(invitesMinted < TOTAL_SUPPLY, "All invites are minted");
    require(balanceOf(msg.sender) > 1, "You are already have an invite");

    _mint(msg.sender, nextId);
    nextId++;
    invitesMinted++;
  }

}