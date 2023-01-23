//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NotInspector();
error YouAreNotBuyer();

contract RealEstate {
    struct List {
        uint256 tokenId;
        address nftAddress;
        address buyer;
        address seller;
        address inspector;
        uint256 purchasePrice;
        uint256 escrowAmount;
        bool inspectionStatus;
        string tokenURI;
    }

    event Listed(
        uint256 indexed tokenId,
        address indexed nftAddress,
        address buyer,
        address seller,
        address inspector,
        uint256 indexed purchasePrice,
        uint256 escrowAmount,
        bool inspectionStatus,
        string tokenURI
    );

    event UpdateInspection(
        uint256 indexed tokenId,
        address indexed nftAddress,
        uint256 indexed pruchasePrice
    );
    event Deposited(uint256 indexed tokenId, address indexed buyer, address indexed nftAddress);
    event Sold(uint256 indexed tokenId);
    event Canceled(uint256 indexed tokenId, address indexed nftAddress, uint256 indexed purchasePrice);

    mapping(uint256 => List) private s_lists;

    modifier onlyBuyer(uint256 tokenId) {
        List memory list = s_lists[tokenId];
        if (msg.sender != list.buyer) {
            revert YouAreNotBuyer();
        }
        _;
    }

    function list(
        uint256 tokenId,
        address nftAddress,
        address buyer,
        address inspector,
        uint256 purchasePrice,
        uint256 escrowAmount,
        bool inspectionStatus,
        string memory tokenURI
    ) external {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        s_lists[tokenId] = List(
            tokenId,
            nftAddress,
            buyer,
            msg.sender,
            inspector,
            purchasePrice,
            escrowAmount,
            inspectionStatus,
            tokenURI
        );
        emit Listed(
            tokenId,
            nftAddress,
            buyer,
            msg.sender,
            inspector,
            purchasePrice,
            escrowAmount,
            inspectionStatus,
            tokenURI
        );
    }

    function inspectionStatus(uint256 tokenId) external {
        List memory list = s_lists[tokenId];
        if (msg.sender != list.inspector) {
            revert NotInspector();
        }
        s_lists[tokenId].inspectionStatus = true;
        emit UpdateInspection(tokenId, list.nftAddress, list.purchasePrice);
    }

    function deposit(uint256 tokenId) external payable onlyBuyer(tokenId) {
        List memory list = s_lists[tokenId];
        require(msg.value >= list.escrowAmount);
        emit Deposited(tokenId, msg.sender, list.nftAddress);
    }

    function finalize(uint256 tokenId) external payable onlyBuyer(tokenId) {
        List memory list = s_lists[tokenId];
        require(msg.value >= list.purchasePrice);
        if (address(this).balance > list.purchasePrice) {
            delete(list);
            (bool success, ) = payable(list.seller).call{value: list.purchasePrice}("");
            require(success);
        }
        IERC721(list.nftAddress).transferFrom(address(this), list.buyer, tokenId);
        emit Sold(tokenId);
    }

    function cancel(uint256 tokenId) external {
        List memory list = s_lists[tokenId];
        if(list.inspectionStatus) {
            (bool success, ) = payable(list.buyer).call{value: list.escrowAmount}("");
            require(success);
        }
        emit Canceled(tokenId, list.nftAddress, list.purchasePrice);
    }

    function getList(uint256 tokenId) external view returns(List memory) {
        return s_lists[tokenId];
    }
}
