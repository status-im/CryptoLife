const namehash = require('eth-ens-namehash');

var ENSRegistry = artifacts.require("./ENSRegistry.sol");
var FIFSRegistrar = artifacts.require("./FIFSRegistrar.sol");
var PublicResolver = artifacts.require("./PublicResolver.sol");
var MarkerResolver = artifacts.require("./MarkerResolver.sol");
var DAI = artifacts.require("./DAI.sol");

const zero = '0x0000000000000000000000000000000000000000000000000000000000000000';

module.exports = function(deployer) {
  deployer.deploy(ENSRegistry)
    .then(() => deployer.deploy(FIFSRegistrar, ENSRegistry.address, namehash.hash('eth')))
    .then(() => deployer.deploy(PublicResolver, ENSRegistry.address))
    .then(() => deployer.deploy(DAI))
    .then(() => deployer.deploy(MarkerResolver, ENSRegistry.address, DAI.address));
};
