// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Dosu Invites NFT
 * @dev Acts as a key to use https://dosu.io
 */
contract DosuInvites is ERC721Enumerable, Ownable {
  // Uses
  using Counters for Counters.Counter;
  // State
  uint256 public constant MAX_INVITES_SUPPLY = 1000;
  Counters.Counter public mintedTokensCount;
  bytes32 public allowlistMerkleRoot;
  // Events
  event Mint(address to, uint256 tokenId);

  constructor() ERC721("Dosu Invites", "DOSU") {
    mintedTokensCount.increment();
  }

  /**
   * @dev Mints an invite
   * @param merkleProof Merkle tree hex proof of the sender being a part of the allowlist
   */
  function mint(bytes32[] calldata merkleProof) public {
    // Check preconditions
    require(balanceOf(msg.sender) == 0, "Sender already has an invite");
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(
      MerkleProof.verify(merkleProof, allowlistMerkleRoot, leaf),
      "Merkle proof verification failed"
    );
    require(
      mintedTokensCount.current() < MAX_INVITES_SUPPLY,
      "Already minted all the allowed invites"
    );
    // Mint the token
    mintedTokensCount.increment();
    uint256 tokenId = mintedTokensCount.current();
    _safeMint(msg.sender, tokenId);
    // Emit the mint event
    emit Mint(msg.sender, tokenId);
  }

  /**
  @dev Sets the Merkle root of the allowlist
  @param merkleRoot The new Merkle root of the allowlist
  */
  function setAllowlistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
    allowlistMerkleRoot = merkleRoot;
  }

  function _beforeTokenTransfer(
    address _from,
    address _to,
    uint256 _tokenId
  ) internal override(ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);
  }

  function supportsInterface(bytes4 _interfaceId)
    public
    view
    override(ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(_interfaceId);
  }
}
