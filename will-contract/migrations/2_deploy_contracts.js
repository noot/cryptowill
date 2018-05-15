var WillCreator = artifacts.require("./WillCreator.sol");

module.exports = function(deployer) { 
  deployer.deploy(WillCreator, {gas: 4600000});
};