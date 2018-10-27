var Salaries = artifacts.require("./Salaries.sol");

module.exports = function(deployer) {
	deployer.deploy(Salaries);
};