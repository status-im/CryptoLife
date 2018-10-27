/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

	networks: {
		development: {
			provider: function () {
				const wallet = new HDWalletProvider(
					"***12 words***",
					"https://rinkeby.infura.io/***key***"
				);
				const nonceTracker = new NonceTrackerSubprovider();
				wallet.engine._providers.unshift(nonceTracker);
				nonceTracker.setEngine(wallet.engine);
				return wallet;
			},
			network_id: "*", // Match any network (determined by provider)
			gas: 4500000,
			gasPrice: 21000000000 // 21 GWei
		},
		test: {
			host: "localhost",
			network_id: "*",
			port: 8666,
			gas: 0xffffffff,
			gasPrice: 1
		}
	},
};
