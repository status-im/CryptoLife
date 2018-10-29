const Marketplace = artifacts.require("./Marketplace");

module.exports = async function(deployer, network, accounts) {
	if(network === "test") {
		console.log("[deploy marketplace] test network - skipping the migration script");
		return;
	}
	if(network === "coverage") {
		console.log("[deploy marketplace] coverage network - skipping the migration script");
		return;
	}

	await deployer.deploy(Marketplace);

};
