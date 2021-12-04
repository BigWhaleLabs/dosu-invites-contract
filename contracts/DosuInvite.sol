// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address public treasure;
  address public txFeeToken;
  uint public txFeeAmount;
  uint public totalInvites;
  
  mapping(address => bool) public excludedList;

  constructor(
    address _treasure, 
    address _txFeeToken,
    uint _txFeeAmount,
    uint _totalInvites
  ) ERC721("Dosu Invites", "DOSU") {
    treasure = _treasure;
    txFeeToken = _txFeeToken;
    txFeeAmount = _txFeeAmount;
    totalInvites = _totalInvites;

    excludedList[_treasure] = true; 
    // _mint(treasure, 0);
  }

  function setExcluded(address excluded, bool status) external {
    require(msg.sender == treasure, "treasure only");
    excludedList[excluded] = status;
  }

  function mint() public {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
  }

  function transferFrom(
    address from, 
    address to, 
    uint256 tokenId
  ) public payable override {
     require(
       _isApprovedOrOwner(_msgSender(), tokenId), 
       "ERC721: transfer caller is not owner nor approved"
     );
     if(excludedList[from] == false) {
      _payTxFee(from);
     }
     _transfer(from, to, tokenId);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
   ) public payable override {
     if(excludedList[from] == false) {
       _payTxFee(from);
     }
     safeTransferFrom(from, to, tokenId, "");
   }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public payable override {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId), 
      "ERC721: transfer caller is not owner nor approved"
    );
    if(excludedList[from] == false) {
      _payTxFee(from);
    }
    _safeTransfer(from, to, tokenId, _data);
  }

  function _payTxFee(address from) internal {
    payable(from).transfer(txFeeAmount);
  }
}