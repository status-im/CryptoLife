const bs58 = require('bs58');

const util = {

    expectThrow: async promise => {
        try {
            let result = await promise;
            console.log(result);
        } catch (error) {
            const outOfGas = error.message.search('out of gas') >= 0;
            const revert = error.message.search('revert') >= 0;
            const outOfMoney = error.message.search('doesn\'t have enough funds') >= 0;
            const invalidAddress = error.message.search('BigNumber Error: new BigNumber()') >= 0;
            const invalidContractAddress = error.message.search('not a contract address') >= 0;
            const invalidOpcode = error.message.search('invalid opcode') >= 0;

            assert(outOfGas || revert || outOfMoney || invalidContractAddress || invalidOpcode || invalidAddress, "Expected throw, got '" + error + "' instead");
            return
        }

        assert.fail('Expected throw not received');
    },

    getBytes32FromIpfsHash: (ipfsListing) => {
        return "0x" + bs58.decode(ipfsListing).slice(2).toString('hex')
    },

    getIpfsHashFromBytes32: (bytes32Hex) => {
        const hashHex = "1220" + bytes32Hex.slice(2);
        const hashBytes = Buffer.from(hashHex, 'hex');
        return bs58.encode(hashBytes);
    },

    /**
     * getNextNMontsInDays - returns day count of next n month
     */
    getNextNMontsInDays: (months) => {
        const date = new Date();
        // day to milliseconds rate
        const secToDayRate = 8.64e+7;
        let datePlusNMonths = new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
        return Math.floor((datePlusNMonths - date) / secToDayRate)
    }
};

module.exports = util;