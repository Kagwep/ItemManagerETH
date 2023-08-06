const HouseRentalTransactionHandler = artifacts.require("HouseRentalTransactionHandler");

module.exports = function (deployer) {
  deployer.deploy(HouseRentalTransactionHandler);
};
