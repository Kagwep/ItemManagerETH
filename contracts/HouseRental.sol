// SPDX-License-Identifier: MIT
pragma solidity >=0.4.1 < 0.9.0;

import "./HouseRentalTransactionHandler.sol";

contract HouseRental {
    HouseRentalTransactionHandler public transactionHandler;
    address public owner;

    struct House {
        uint256 houseNumber;
        uint256 price;  // Price is just a reference number
        bool occupied;
        address tenant;
    }

    House[] public houses;

    event HouseRented(uint256 indexed houseNumber, address indexed tenant);

    constructor(address _transactionHandler) {
        transactionHandler = HouseRentalTransactionHandler(_transactionHandler);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function setTransactionHandler(address _transactionHandler) public onlyOwner {
        transactionHandler = HouseRentalTransactionHandler(_transactionHandler);
    }

    function addHouse(uint256 _houseNumber, uint256 _price) public onlyOwner {
        houses.push(House({
            houseNumber: _houseNumber,
            price: _price,
            occupied: false,
            tenant: address(0)
        }));
    }

    function rentHouse(uint256 _houseNumber, uint256 _rentalAmount) public {
        require(_houseNumber < houses.length, "Invalid house number");
        House storage house = houses[_houseNumber];

        require(!house.occupied, "House is already occupied");
        require(_rentalAmount >= house.price, "Insufficient rental amount");

        // Use the transaction handler to transfer funds and pay for gas
        // transactionHandler.executeTransaction{value: _rentalAmount}(payable(address(this)), _rentalAmount);

        house.occupied = true;
        house.tenant = msg.sender;

        emit HouseRented(_houseNumber, msg.sender);
    }


    function getHouseInfo(uint256 _houseNumber) public view returns (uint256, uint256, bool, address) {
        require(_houseNumber < houses.length, "Invalid house number");
        House storage house = houses[_houseNumber];

        return (house.houseNumber, house.price, house.occupied, house.tenant);
    }


}
