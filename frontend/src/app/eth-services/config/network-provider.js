const ethers = require('ethers');


const provider = function () {

    return new ethers.providers.InfuraProvider("ropsten", "Eu84fF12a9U6jQHlhjtB");

};

module.exports = {
    provider
};