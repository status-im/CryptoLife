const bs58 = require('bs58');

const util = {

    getBytes32FromIpfsHash: (ipfsListing) => {
        return '0x' + bs58.decode(ipfsListing).slice(2).toString('hex');
    },

    getIpfsHashFromBytes32: (bytes32Hex) => {
        const hashHex = '1220' + bytes32Hex.slice(2);
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes);
        return hashStr;
    }
};

module.exports = util;