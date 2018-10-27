var Bookings = artifacts.require("./Bookings.sol");

module.exports = function(deployer, env, accounts) {
  deployer.deploy(Bookings, accounts[0], 300000000000000, 300000000000000);
};
