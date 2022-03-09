// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DosuInvites is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    /// @dev token counter
    Counters.Counter public tokenId;

    /// @dev base URI
    string public baseURI;

    /// @dev max tokens supply
    uint256 public constant MAX_INVITES_SUPPLY = 1000;

    /// @dev allowlist Merkle root
    bytes32 public merkleRoot;
    /// @dev list of owned tokenId by address
    mapping(address => uint256) public ownedTokenByAddress;

    mapping(address => bool) public allowlistClaimed;

    struct Invite {
        address ethAddress;
        uint256 tokenId;
    }

    event Mint(address to, uint256 tokenId);

    /// @dev array of minted invites includes ethAddress and tokenId
    Invite[] internal mintedInvites;

    constructor() ERC721("Dosu Invites", "DOSU") {}

    /// @notice Mint invite function
    function mint(bytes32[] calldata _merkleProof) public {
        require(!allowlistClaimed[msg.sender], "Address already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid Merkle proof"
        );
        require(
            balanceOf(msg.sender) == 0,
            "This address is already have an invite"
        );
        require(tokenId.current() <= MAX_INVITES_SUPPLY, "No invites left");

        uint256 _tokenId = tokenId.current();
        _safeMint(msg.sender, _tokenId);
        tokenId.increment();

        emit Mint(msg.sender, _tokenId);

        Invite memory invite = Invite({
            tokenId: _tokenId,
            ethAddress: msg.sender
        });
        mintedInvites.push(invite);
        ownedTokenByAddress[msg.sender] = _tokenId;
        allowlistClaimed[msg.sender] = true;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _uri = _baseURI();
        string memory _address = _addressToString(ownerOf(_tokenId));

        return
            string(
                abi.encodePacked(
                    _uri,
                    "?filename=",
                    _tokenId.toString(),
                    "-",
                    _address,
                    ".png"
                )
            );
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function _baseURI() internal view override(ERC721) returns (string memory) {
        return baseURI;
    }

    /// @notice Mint invite function
    /// @param _owner Owner address
    /// @return Token id that correspond to passed address
    function checkTokenId(address _owner) public view returns (uint256) {
        return ownedTokenByAddress[_owner];
    }

    /// @notice Function that returns array of Invites structs, includes all minted invites
    /// @return Invite[] array
    function getMintedInvites() public view returns (Invite[] memory) {
        return mintedInvites;
    }

    function _addressToString(address _address)
        internal
        pure
        returns (string memory)
    {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(
                uint8(uint256(uint160(_address)) / (2**(8 * (19 - i))))
            );
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = _char(hi);
            s[2 * i + 1] = _char(lo);
        }
        return string(abi.encodePacked("0x", s));
    }

    function _char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }
}
