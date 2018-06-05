var WillCreator = artifacts.require("../contracts/WillCreator.sol");

module.exports = function(deployer) { 
  deployer.deploy(WillCreator, {gas: 3000000});
};
