// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DosuInvites is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    /// @dev token counter
    Counters.Counter public tokenId;

    /// @dev max tokens supply
    uint256 public constant MAX_INVITES_SUPPLY = 1000;

    /// @dev addresses whitelist that allowed to mint
    mapping(address => bool) public whitelist;
    /// @dev list of owned tokenId by address
    mapping(address => uint256) public ownedTokenByAddress;

    struct Invite {
        address ethAddress;
        string tokenURI;
    }

    event Mint(address to, uint256 tokenId);

    /// @dev mapping {[tokenId: uint256]: Invite}
    mapping(uint256 => Invite) public mintedInvites;
    uint256 public addressRegistryCount;

    constructor() ERC721("Dosu Invites", "DOSU") {}

    /// @notice Mint invite function
    /// @param _to Recipient address
    function mint(address _to) public {
        require(whitelist[_to] == true, "This address is not whitelisted");
        require(balanceOf(_to) == 0, "This address already has an invite");
        require(tokenId.current() <= MAX_INVITES_SUPPLY, "No invites left");

        uint256 _tokenId = tokenId.current();
        _safeMint(_to, _tokenId);
        tokenId.increment();

        emit Mint(_to, _tokenId);

        mintedInvites[_tokenId] = Invite({ethAddress: _to, tokenURI: ""});
        addressRegistryCount++;
        ownedTokenByAddress[_to] = _tokenId;
    }

    function tokenURI(uint256 _tokenId, string memory _cid)
        public
        virtual
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory uri = string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/",
                _cid,
                "/",
                _tokenId.toString(),
                "-",
                _addressToString(ownerOf(_tokenId)),
                ".png"
            )
        );

        mintedInvites[_tokenId].tokenURI = uri;

        return uri;
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
    /// @dev Converting {uint: Invite} mapping into Invite[]
    /// @return Invite[] array
    function getMintedInvites() public view returns (Invite[] memory) {
        Invite[] memory toReturn = new Invite[](addressRegistryCount);

        for (uint256 i = 0; i < addressRegistryCount; i++) {
            toReturn[i] = mintedInvites[i];
        }

        return toReturn;
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
