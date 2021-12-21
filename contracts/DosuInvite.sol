// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DosuInvites is ERC721, Ownable {
  using Counters for Counters.Counter;
  /// @dev token counter
  Counters.Counter private _tokenIds;

  /// @dev max tokens supply
  uint256 public constant MAX_INVITES_SUPPLY = 1000;

  /// @dev addresses whitelist that allowed to mint
  mapping(address => bool) public whitelist;
  /// @dev list of owned tokenId by address
  mapping(address => uint256) public ownedTokenByAddress;

  struct Invite {
    address ethAddress;
    uint256 tokenId;
  }

  event Mint(address to   , uint256 tokenId);

  /// @dev array of minted invites includes ethAddress and tokenId
  Invite[] internal mintedInvites;

  constructor() ERC721("Dosu Invites", "DOSU") {}

  /// @notice Mint invite function
  /// @param _to Recipient address
  function mint(address _to) public {
    require(whitelist[_to] == true, "This address is not whitelisted");
    require(balanceOf(_to) == 0, "This address is already have an invite");
    require(_tokenIds.current() <= MAX_INVITES_SUPPLY, "No invites left");

    _tokenIds.increment();

    uint256 newInviteId = _tokenIds.current();
    _mint(_to, newInviteId);

    emit Mint(_to, newInviteId);

    Invite memory invite = Invite({tokenId: newInviteId, ethAddress: _to});
    mintedInvites.push(invite);
    ownedTokenByAddress[_to] = newInviteId;
  }

  /// @notice Mint invite function
  /// @param _owner Owner address
  /// @return Token id that correspond to passed address
  function checkTokenId(address _owner) public view returns (uint256) {
    return ownedTokenByAddress[_owner];
  }

  /// @notice Function for adding address to the whitelist
  /// @param _user Owner address
  function whitelistAddress(address _user) public onlyOwner {
    whitelist[_user] = true;
  }

  /// @notice Function that returns array of Invites structs, includes all minted invites
  /// @return Invite[] array
  function getMintedInvites() public view returns(Invite[] memory){
    return mintedInvites;
  }
}
