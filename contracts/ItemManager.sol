// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Item.sol";

contract ItemManager {
    enum SupplyChainState { Created, Paid, Delivered }

    struct S_Item {
        Item item;
        string id;
        uint256 price;
        SupplyChainState state;
    }

    mapping(uint256 => S_Item) public items;
    uint256 index;

    event SupplyChainStep(uint256 _itemIndex, uint256 _step);

    function createItem(string memory _id, uint256 _price) public {
        Item item = new Item(this, index, _price);
        items[index].item = item;
        items[index].id = _id;
        items[index].price = _price;
        items[index].state = SupplyChainState.Created;
        emit SupplyChainStep(index, uint256(items[index].state));
        index++;
    }

    function triggerPayment(uint256 _itemIndex) public {
        require(items[_itemIndex].state == SupplyChainState.Created, "Item is further in the supply chain");
        items[_itemIndex].state = SupplyChainState.Paid;
        emit SupplyChainStep(_itemIndex, uint256(items[_itemIndex].state));
    }

    function triggerDelivery(uint256 _itemIndex) public {
        require(items[_itemIndex].state == SupplyChainState.Paid, "Item is further in the supply chain");
        items[_itemIndex].state = SupplyChainState.Delivered;
        emit SupplyChainStep(_itemIndex, uint256(items[_itemIndex].state));
    }
    
    function fundTransaction(uint256 _itemIndex) public payable {
        require(items[_itemIndex].state == SupplyChainState.Created, "Item is further in the supply chain");
        address(items[_itemIndex].item).transfer(msg.value);
    }
}
