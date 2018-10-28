let BrandiePlatform = artifacts.require("./BrandiePlatform.sol");
let ECVerify = artifacts.require("./ECVerify.sol");

async function deploy(deployer) {
    await deployer.deploy(ECVerify);
    await deployer.link(ECVerify, BrandiePlatform);
    await deployer.deploy(BrandiePlatform);
    let fs = require("fs");
    let jsonObject = {
        brandie_platform_address: BrandiePlatform.address,
        brandie_platform_abi: BrandiePlatform.abi
    }

    fs.writeFile("data.json", JSON.stringify(jsonObject), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = deploy;
