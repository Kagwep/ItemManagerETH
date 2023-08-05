const ItemManager = artifacts.require("ItemManager");
const Item = artifacts.require("Item");

module.exports = async function (deployer) {
  await deployer.deploy(ItemManager);
  const itemManagerInstance = await ItemManager.deployed();

  await deployer.deploy(Item, itemManagerInstance.address, 0, web3.utils.toWei("1", "ether"));
};
