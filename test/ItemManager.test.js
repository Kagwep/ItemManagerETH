const ItemManager = artifacts.require("ItemManager");
const Item = artifacts.require("Item");

contract("ItemManager", accounts => {
  it("should create an item", async () => {
    const itemManagerInstance = await ItemManager.deployed();
    await itemManagerInstance.createItem("Test Item", web3.utils.toWei("1", "ether"), { from: accounts[0] });

    const item = await itemManagerInstance.items(0);
    assert.equal(item.state, 0, "Item state should be Created");
  });

  it("should fund a transaction", async () => {
    const itemManagerInstance = await ItemManager.deployed();
    await itemManagerInstance.createItem("Test Item", web3.utils.toWei("1", "ether"), { from: accounts[0] });

    const itemPrice = await itemManagerInstance.items(0).price();
    await itemManagerInstance.fundTransaction(0, { from: accounts[0], value: itemPrice });

    const contractBalance = await web3.eth.getBalance(itemManagerInstance.address);
    assert.equal(contractBalance.toString(), itemPrice.toString(), "Contract balance should match item price");
  });

  it("should trigger payment", async () => {
    const itemManagerInstance = await ItemManager.deployed();
    await itemManagerInstance.createItem("Test Item", web3.utils.toWei("1", "ether"), { from: accounts[0] });

    const itemPrice = await itemManagerInstance.items(0).price();
    await itemManagerInstance.fundTransaction(0, { from: accounts[0], value: itemPrice });

    await itemManagerInstance.triggerPayment(0, { from: accounts[0] });

    const item = await itemManagerInstance.items(0);
    assert.equal(item.state, 1, "Item state should be Paid");
  });

  it("should trigger delivery", async () => {
    const itemManagerInstance = await ItemManager.deployed();
    await itemManagerInstance.createItem("Test Item", web3.utils.toWei("1", "ether"), { from: accounts[0] });

    const itemPrice = await itemManagerInstance.items(0).price();
    await itemManagerInstance.fundTransaction(0, { from: accounts[0], value: itemPrice });
    await itemManagerInstance.triggerPayment(0, { from: accounts[0] });
    await itemManagerInstance.triggerDelivery(0, { from: accounts[0] });

    const item = await itemManagerInstance.items(0);
    assert.equal(item.state, 2, "Item state should be Delivered");
  });
});
