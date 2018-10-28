var Salaries = artifacts.require("./Salaries.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
	deployer.deploy(Salaries);
	deployer.deploy(SimpleStorage);
};