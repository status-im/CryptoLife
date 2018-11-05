const conf = require('./config');
const log = require('./log')('observer');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(conf.observer.ws));


let eventMap = {};
let contractMap = {};


function initContracts(contracts) {
    contracts.forEach(contract => {
        contractMap[contract.name] = new web3.eth.Contract(contract.abi, contract.address);
        log.info(`New contract, name: ${contract.name} address: ${contract.address}`);
    });
}

function onEvent(contractName, eventName, event) {
    let cbs = eventMap[contractName][eventName];

    cbs.forEach(cb => cb(event));
    log.debug(`Event received, event: ${JSON.stringify(event)}`);
}

function newSubscription(contractName, eventName, fromBlock = null) {
    let contract = contractMap[contractName];

    if (typeof fromBlock === 'number') {
        contract.getPastEvents(
            eventName,
            {fromBlock: fromBlock, toBlock: "latest"},
            (errors, events) => {
                if (!errors) {
                    events.forEach((event) => onEvent(contractName, eventName, event));
                }
            }
        );
    }

    contract.events[eventName](event => {
        onEvent(contractName, eventName, event);
    });
}

function subscribe(args, cb) {
    if (!(args.contractName in contractMap)) {
        return;
    }

    if (!(args.contractName in eventMap)) {
        eventMap[args.contractName] = new Map();
    }

    let contractEvents = eventMap[args.contractName];

    if (!(args.eventName in contractEvents)) {
        newSubscription(args.contractName, args.eventName, args.fromBlock);
        contractEvents[args.eventName] = [];
    }

    contractEvents[args.eventName].push(cb);

    log.info(`New subscribe, contract: ${args.contractName} event: ${args.eventName} fromBlock: ${args.fromBlock}`);
}

function call(contractName, method, args = []) {
    let contract = contractMap[contractName];

    return contract[method].call(...args);
}

module.exports = {
    initContracts: initContracts,
    subscribe: subscribe,
    call: call,
};