// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract Item {
    ItemManager public itemManager;
    uint256 public price;
    uint256 public itemIndex;

    constructor(ItemManager _itemManager, uint256 _itemIndex, uint256 _price) {
        itemManager = _itemManager;
        itemIndex = _itemIndex;
        price = _price;
    }

    function pay() public payable {
        require(msg.sender == address(itemManager), "Only ItemManager can pay");
        require(msg.value == price, "Incorrect price provided");
        itemManager.triggerPayment(itemIndex);
    }
}
