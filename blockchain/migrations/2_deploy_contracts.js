const DateTime = artifacts.require("./DateTime.sol");
const Bookings = artifacts.require("./Bookings.sol");

module.exports = function(deployer, env, accounts) {
  deployer.deploy(DateTime);
  deployer.link(DateTime, Bookings);
  deployer.deploy(Bookings, accounts[2], 300000000000000000, 300000000000000000);
};
