var ChainOfLife = artifacts.require("ChainOfLife");

module.exports = function(deployer) {
  deployer.deploy(ChainOfLife, 0);
};
