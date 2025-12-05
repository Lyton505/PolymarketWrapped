// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PolymarketWrappedBadge
 * @dev ERC-721 NFT contract for Polymarket Wrapped badges
 * Deployed on Base chain with gasless minting via ERC-4337
 */
contract PolymarketWrappedBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping to track if an address has already minted
    mapping(address => bool) public hasMinted;

    // Events
    event BadgeMinted(address indexed to, uint256 indexed tokenId, string uri);

    constructor()
        ERC721("Polymarket Wrapped 2025", "PMWRAP")
        Ownable(msg.sender)
    {}

    /**
     * @dev Mint a Wrapped Badge NFT
     * @param to Address to mint the badge to
     * @param uri Metadata URI for the badge (should contain user's stats/image)
     *
     * Each address can only mint one badge per year
     */
    function mintWrappedBadge(
        address to,
        string memory uri
    ) public returns (uint256) {
        require(!hasMinted[to], "Address has already minted a badge");
        require(bytes(uri).length > 0, "URI cannot be empty");

        uint256 tokenId = _nextTokenId++;
        hasMinted[to] = true;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit BadgeMinted(to, tokenId, uri);

        return tokenId;
    }

    /**
     * @dev Check if an address can mint
     */
    function canMint(address account) public view returns (bool) {
        return !hasMinted[account];
    }

    /**
     * @dev Get total supply of minted badges
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Override required by Solidity
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Emergency function to reset minting status (owner only)
     * Use case: If a user needs to re-mint due to technical issues
     */
    function resetMintStatus(address account) external onlyOwner {
        hasMinted[account] = false;
    }
}
