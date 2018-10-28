const observer = require('./observer');
const twitter = require('./twitter');
const log = require('./log')('main');
const conf = require('./config');
const axios = require('axios');


async function obtainIpfsData(ipfsHash) {
    try {
        let resp = await axios.get(conf.ipfs.url + ipfsHash);

        if (typeof resp.data === 'string') {
            return JSON.parse(resp.data);
        }
        return resp.data;
    }
    catch(err) {
        log.error(`IPFS get error: ${JSON.stringify(err)}`);
    }
}



observer.initContracts([{
    name: 'listing',
    abi: JSON.parse(conf.contract.abi),
    address: conf.contract.address
}]);





observer.subscribe({
    contractName: 'listing',
    eventName: conf.contract.events.application,
    fromBlock: conf.contract.fromBlock
}, async (event) => {
    log.info(`Event received ${JSON.stringify(event)}`);

    try {
        let listing = await observer.call('listing', 'get_info');
        log.info(`Listing obtained: ${JSON.stringify(listing)}`);

        let ipfsData = await obtainIpfsData(listing.ipfs_hash);
        log.info(`IPFS data obtained: ${JSON.stringify(ipfsData)}`);

        let resp = await twitter.newTweet({
            status: `Moving started itemID: ${event.returnValues.itemId} movingID: ${event.returnValues.movingId}`
        });
        log.info(`Tweet sended: ${JSON.stringify(resp)}`);
    }
    catch (e) {
        log.error(`Error: ${e}`);
    }
});





process.on('uncaughtException', (err) => {
    log.error('Unexpected error:', JSON.stringify(err));
});

process.on('unhandledRejection', (err) => {
    log.error('Unexpected error:', JSON.stringify(err));
});