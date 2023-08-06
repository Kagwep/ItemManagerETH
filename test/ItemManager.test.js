const HouseRentalTransactionHandler = artifacts.require("HouseRentalTransactionHandler");
const HouseRental = artifacts.require("HouseRental");
const BN = web3.utils.BN;

contract("HouseRental", accounts => {
  let transactionHandlerInstance;
  let houseRentalInstance;

  const fundAmount = web3.utils.toWei("0.5", "ether"); // Fund the handler with 0.5 Ether
  const housePrice = new BN(5500);

  before(async () => {
    transactionHandlerInstance = await HouseRentalTransactionHandler.deployed();
    houseRentalInstance = await HouseRental.deployed();
    await transactionHandlerInstance.addFunds({ from: accounts[0], value: fundAmount }); // Fund the handler
  });

  it("should handle house rental transactions", async () => {
    // Add a house
    await houseRentalInstance.addHouse(0, housePrice);

    // Rent the house
    await houseRentalInstance.rentHouse(0, housePrice, "Alice", { from: transactionHandlerInstance.address });

    // Get house info
    const [houseNumber, price, occupied, tenant] = await houseRentalInstance.getHouseInfo(0);
    assert.equal(houseNumber, 0, "Incorrect house number");
    assert.isTrue(price.eq(housePrice), "Incorrect house price");
    assert.equal(occupied, true, "House should be occupied");
    assert.equal(tenant, "Alice", "Incorrect tenant name");
  });

  it("should handle house rental with insufficient rental amount", async () => {
    // Add another house
    await houseRentalInstance.addHouse(1, housePrice);

    // Attempt to rent the house with insufficient rental amount
    try {
      await houseRentalInstance.rentHouse(1, housePrice.div(new BN(2)), "Bob", { from: transactionHandlerInstance.address });
    } catch (error) {
      assert.include(error.message, "Insufficient rental amount", "Expected error not received");
    }
  });

  it("should not allow non-owner to set transaction handler", async () => {
    // Attempt to set transaction handler by non-owner
    try {
      await houseRentalInstance.setTransactionHandler(accounts[1], { from: accounts[1] });
    } catch (error) {
      assert.include(error.message, "Only the owner can perform this action", "Expected error not received");
    }
  });

  it("should not allow renting an occupied house", async () => {
    // Attempt to rent an occupied house
    try {
      await houseRentalInstance.rentHouse(0, housePrice, "Charlie", { from: transactionHandlerInstance.address });
    } catch (error) {
      assert.include(error.message, "House is already occupied", "Expected error not received");
    }
  });

  it("should get correct house info", async () => {
    // Get house info
    const [houseNumber, price, occupied, tenant] = await houseRentalInstance.getHouseInfo(0);
    assert.equal(houseNumber, 0, "Incorrect house number");
    assert.isTrue(price.eq(housePrice), "Incorrect house price");
    assert.equal(occupied, true, "House should be occupied");
    assert.equal(tenant, "Alice", "Incorrect tenant name");
  });
});
