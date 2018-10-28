'use strict';


const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

const ethers = require('ethers');
const ipfs = require('./ipfs');
/*
const ipfs = (function() {
    const ipfsAPI = require('ipfs-api');
    return ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
})();
*/
function App() {
    EventEmitter.call(this);

    let account = null;

    Object.defineProperty(this, 'account', {
        get: function() { return account; }
    });

    let managed = false;
    let provider = null;

    ethers.utils.defineReadOnly(this, 'setNetwork', (network) => {
        if (managed) { throw new Error('this environment network is managed by an Injected Ethereum'); }
        provider = ethers.getDefaultProvider(network);
        provider.getNetwork((network) => {
            this.emit('network', network);
        });
    });

    Object.defineProperty(this, 'provider', {
        get: function() { return provider; }
    });

    // Injected EIP 1193 Provider
    // See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
    //if (global.ethereum) {
    if (global.web3) {
        console.log("Using Injected Ethereum");

        managed = true;

        //let ethereum = global.ethereum;
        let web3 = global.web3;
/*
        ethereum.enable().then(() => {
            console.log('ok');
        }, (error) => {
            console.log(error);
        });

        ethereum.on('networkChanged', (networkId) => {
            console.log('networkChanged', networkId);
            this.emit('network');
        });

        ethereum.on('accountsChanged', (accounts) => {
            console.log('accountsChanged', accounts);
            this.emit('account');
        });

        let BridgeProvider = {
            sendAsync: (payload, callback) => {
                console.log('>>>', payload.method, payload.params);
                //payload = JSON.parse(payload);
                let promise = ethereum.send(payload.method, payload.params);
                console.log(promise);
                promise.then((result) => {
                    console.log('<<<', result);
                    callback(null, result);
                }, (error) => {
                    console.log('error', error);
                    callback(error);
                });;
            }
        };

        provider = new ethers.providers.Web3Provider(BridgeProvider);
        this.emit('network');
*/
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
        this.emit('network');
    } else {
        this.setNetwork('homestead');
    }

    setInterval(() => {
    }, 100);
}
inherits(App, EventEmitter);

ethers.utils.defineReadOnly(App.prototype, 'fetchIpfs', function(multihash) {
    /*
    return ipfs.files.get(multihash).then((results) => {
        return new Uint8Array(results[0].content);
    });
    */
    return ipfs(multihash).then((result) => {
        return new Uint8Array(new Buffer(result));
    });
});

global.app = new App();
global.ethers = ethers;
