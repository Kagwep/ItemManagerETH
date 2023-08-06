const HouseRental = artifacts.require("HouseRental");
const HouseRentalTransactionHandler = artifacts.require("HouseRentalTransactionHandler");

module.exports = async function (deployer) {
  await deployer.deploy(HouseRentalTransactionHandler);
  const transactionHandlerInstance = await HouseRentalTransactionHandler.deployed();

  await deployer.deploy(HouseRental, transactionHandlerInstance.address);
};
