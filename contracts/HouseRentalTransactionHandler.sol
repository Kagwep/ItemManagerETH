// SPDX-License-Identifier: MIT
pragma solidity >=0.4.1 < 0.9.0;

contract HouseRentalTransactionHandler {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

        function addFunds() public payable {
            require(msg.value > 0, "Amount must be greater than 0");

            // No need for further logic, funds are automatically added to the contract balance
        }


    function withdrawFunds(address payable _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient balance");

        _to.transfer(_amount);
    }

    function executeTransaction(address payable _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient balance");

        _to.transfer(_amount);
    }
}
