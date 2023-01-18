//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mint is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private s_tokenId;

    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {}

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        return super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(tokenId);
    }

    function mintToken(address owner, string memory metadataURI)
    public
    returns (uint256)
    {
        s_tokenId.increment();

        uint256 id = s_tokenId.current();
        _mint(owner, id);
        _setTokenURI(id, metadataURI);
        return id;
    }

    function totalSupply() public view returns(uint256) {
        return s_tokenId.current();
    }
}