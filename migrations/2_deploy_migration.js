var AssetTransfer = artifacts.require("./AssetTransfer.sol");

module.exports = function(deployer) {
  deployer.deploy(AssetTransfer,"Jaguar", 1000000);
};