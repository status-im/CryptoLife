'use strict';

const Token = artifacts.require("./Token.sol");
const Faucet = artifacts.require("./Faucet.sol");
const Voting = artifacts.require("./Voting.sol");
const Parameterizer = artifacts.require("./Parameterizer.sol");
const Registry = artifacts.require("Registry.sol");


const initialTokenHolders = [
    '0x6290C445A720E8E77dd8527694030028D1762073',
    '0x49d22f8740d6f08B3235ACE9a90648b206962CBd',
    '0x65dD7690901500FdD6B26f0a4d722e1e859Ad301',
    '0xfF20387Dd4dbfA3e72AbC7Ee9B03393A941EE36E'
];
const initialApplications = [
	'Qmf7L4VLuWsAxDQimWrsjsMmxBPc8AF5B8rF6DhvBVTyBx',
	'QmS8rfAmZDFnZLUxZveP19as5E9YgVz6wzsw3gZWmaig8R',
	'QmdEt1zsm3umViBrx3sQmdRMdEXHqyN6KipG48AT3B25qd',
	'QmYgNZ2XaRMDtUFxyqMwAJXckCoxoBuSzx2HnfczMKAEXn', // DopeRaider
	'QmfPVD1BMuMKwrwrutXTeWRxpEBnY4bvfWz87nh9MtZusT', // Aragon
];

const initialTokens = 1000;
const totalSupply = 1000000;


module.exports = function(deployer, network) {
  let token;
  let voting;
  let params;
  let faucet;
  let registry;

  deployer.deploy(Token).then(function (ret) {
    token = ret;
    return deployer.deploy(Voting);
  }).then(function (ret) {
    voting = ret;
    return deployer.deploy(Faucet, [web3.toWei(100)]);
  }).then(function (ret) {
    faucet = ret;
    return deployer.deploy(Parameterizer, [web3.toWei(100, 'ether'), 60, 60, 60, 50, 50, 60, 60]);
  }).then(function(ret){
    params = ret;
    return deployer.deploy(Registry, token.address, voting.address, params.address);
  }).then(function(ret){
    registry = ret;
    return voting.set_registry(registry.address);
  }).then(function() {
    return token.set_registry(registry.address);
  }).then(function() {
      return token.transfer(faucet.address, web3.toWei(totalSupply - initialTokens * initialTokenHolders.length));
  }).then(function () {
      return Promise.all(
          initialTokenHolders.map(addr => {
            token.transfer(addr, web3.toWei(initialTokens))
          })
      );
  }).then(function () {
      return Promise.all(
          initialApplications.map(ipfs_hash => {
			let bytes_hash = '0x' + Buffer.from(ipfs_hash).toString('hex');
            registry.apply(bytes_hash);
			console.log("applied hash: " + ipfs_hash);
          })
      );
  });

};
