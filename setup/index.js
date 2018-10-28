const Web3 = require('web3');
const namehash = require('eth-ens-namehash');

const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const args = process.argv;
const nodeUrl = args[2] || "http://localhost:8545";

const isLocal = nodeUrl == "http://localhost:8545";

console.log('USING NODE AT : ' + nodeUrl);

const web3 = new Web3(nodeUrl);
const gas = 4000000;

function getContractInfos(contractInfosFolder, networkId) {
    const contractInfos = {};
    fs.readdirSync(contractInfosFolder).forEach(file => {
        const contractInfo = JSON.parse(fs.readFileSync(path.join(contractInfosFolder,file)).toString());
        const networkKeys = Object.keys(contractInfo.networks);
        if(!networkId) {
            if(networkKeys && networkKeys.length > 0) {
                networkId = networkKeys[0];
                console.log('no networkId specified, using networkId', networkId, 'from ', JSON.stringify(contractInfo.networks));
            } else {
                console.error('no networkId specified, and can\'t find one');
            }
        }
        if (networkId && contractInfo.networks[networkId]){
            const currentNetwork = contractInfo.networks[networkId];
            contractInfo.networks = {}; // remove other networks info // TODO not sure why they are there ?
            contractInfo.networks[networkId] = currentNetwork;
            contractInfos[contractInfo.contractName] = contractInfo;
        }
    })

    return {networkId, contractInfos};
}

function deployContracts(truffleNetwork, networkId) {
    console.log('deploying contracts to network ' + networkId);
    return new Promise((resolve, reject) => {
        let contractFolder = './contracts';
        if(isLocal) {
            contractFolder = '../contracts';
        }
        var child = childProcess.exec('yarn truffle migrate --reset --network ' + truffleNetwork, {
            cwd: contractFolder
        })
        child.stdout.pipe(process.stdout)
        child.on('exit', function() {
            resolve(getContractInfos(contractFolder + '/build/contracts', networkId));
        })
    });
}


function pause(duration) {
    return new Promise((res) => setTimeout(res, duration * 1000));
}

function backoff(retries, func, delay = 0.5, multiplier = 2) {
    return func().catch((err) =>
        retries > 1 ?
            pause(delay).then(() => backoff(retries - 1, func, delay * multiplier, multiplier)) :
            Promise.reject(err)
    );
}

let accounts;
let networkId;

function setup(){
    return backoff(10, web3.eth.net.getId, 3, 1)
        .then((id) => {
            networkId = id;
            return web3.eth.getAccounts();
        })
        .then((acc) => {accounts = acc})
        .then(() => deployContracts(isLocal?'localhost':'ganache', networkId))
        .then(run);
}

async function run({networkId, contractInfos}) {
    const contracts = {};
    for(const contractInfoName of Object.keys(contractInfos)) {
        const ContractInfo = contractInfos[contractInfoName];
        console.log('CONTRACT ' + contractInfoName + ' DEPLOYED AT : ' + ContractInfo.networks[networkId].address);
        contracts[contractInfoName] = new web3.eth.Contract(ContractInfo.abi, ContractInfo.networks[networkId].address);
    }

    const zero = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const rootDomain = 'eth';
    await contracts.ENSRegistry.methods.setSubnodeOwner(zero, web3.utils.sha3(rootDomain), contracts.FIFSRegistrar.options.address).send({from: accounts[0], gas});

    const domainToOwn = ['NDQuNTM1IDExLjUzMQ'.toLowerCase(), rootDomain];
    await contracts.FIFSRegistrar.methods.register(web3.utils.sha3(domainToOwn[0]), accounts[1]).send({from: accounts[1], gas});

    const registeredOwner = await contracts.ENSRegistry.methods.owner(namehash.hash(domainToOwn.join('.'))).call();
    console.log('registered owner of : ' + domainToOwn.join('.'), registeredOwner);

    // await ens.methods.setResolver(namehash.hash('myname.geo'), publicResolver.options.address).send({from: squatter});
}

setup()
    .then(console.log)
    .catch(console.error);
