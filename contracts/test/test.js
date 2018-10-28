const Web3 = require('web3');
const namehash = require('eth-ens-namehash');
const {deployContract} = require('./utils');

const web3 = new Web3();
web3.setProvider(global.web3.currentProvider);

const gas = 4000000;

const zero = '0x0000000000000000000000000000000000000000000000000000000000000000';

contract('ENS', (accounts) => {

    let ens;
    let registrar;
    let publicResolver;
    let markerResolver;

    const owner = web3.utils.toChecksumAddress(accounts[0]);
    const squatter = web3.utils.toChecksumAddress(accounts[1]);
    const buyer = web3.utils.toChecksumAddress(accounts[2]);

    beforeEach(async () =>{
        ens = await deployContract('ENSRegistry');
    });
    
    
    it('can register a root domain', async() => {
        const registrar = await deployContract('FIFSRegistrar', ens.options.address, zero);
        await ens.methods.setOwner(zero, registrar.options.address).send({from: owner, gas});

        await registrar.methods.register(web3.utils.sha3('myname'), squatter).send({from: squatter, gas});
        const registeredOwner = await ens.methods.owner(namehash.hash('myname')).call();
        assert.equal(registeredOwner, squatter);
    })

    it('can register a sub domain', async() => {
        const rootDomain = 'geo';
        const domainToOwn = ['myname', rootDomain];
        
        const registrar = await deployContract('FIFSRegistrar', ens.options.address, namehash.hash(rootDomain));

        await ens.methods.setSubnodeOwner(zero, web3.utils.sha3(rootDomain), registrar.options.address).send({from: owner, gas});
        await registrar.methods.register(web3.utils.sha3(domainToOwn[0]), squatter).send({from: squatter, gas});
        
        const registeredOwner = await ens.methods.owner(namehash.hash(domainToOwn.join('.'))).call();
        assert.equal(registeredOwner, squatter);
    });

    it('can create a resolver and ask for a name', async() => {
        const rootDomain = 'geo';
        const domainToOwn = ['myname', rootDomain];
        
        const registrar = await deployContract('FIFSRegistrar', ens.options.address, namehash.hash(rootDomain));

        await ens.methods.setSubnodeOwner(zero, web3.utils.sha3(rootDomain), registrar.options.address).send({from: owner, gas});
        await registrar.methods.register(web3.utils.sha3(domainToOwn[0]), squatter).send({from: squatter, gas});
        
        const node = namehash.hash(domainToOwn.join('.'));

        const registeredOwner = await ens.methods.owner(node).call();
        assert.equal(registeredOwner, squatter);

        const publicResolver = await deployContract('PublicResolver', ens.options.address);
        await publicResolver.methods.setName(node, 'hello').send({from:squatter, gas});
        const nameRegistered = await publicResolver.methods.name(node).call();

        assert.equal(nameRegistered, 'hello');
    })

    it('can create a MarkerResolver and add a marker via DAI', async() => {
        const rootDomain = 'geo';
        const domainToOwn = ['myname', rootDomain];
        
        const registrar = await deployContract('FIFSRegistrar', ens.options.address, namehash.hash(rootDomain));

        await ens.methods.setSubnodeOwner(zero, web3.utils.sha3(rootDomain), registrar.options.address).send({from: owner, gas});
        await registrar.methods.register(web3.utils.sha3(domainToOwn[0]), squatter).send({from: squatter, gas});
        
        const node = namehash.hash(domainToOwn.join('.'));

        const registeredOwner = await ens.methods.owner(node).call();
        assert.equal(registeredOwner, squatter);

        const text = 'coffee for 1 DAI!';
        const dai = await deployContract('DAI');
        const markerResolver = await deployContract('MarkerResolver', ens.options.address, dai.options.address);
        await dai.methods.transfer(buyer, "1000000000000000000").send({from:owner,gas});
        await dai.methods.approve(markerResolver.options.address, "1000000000000000000").send({from:buyer, gas});
        await markerResolver.methods.addMarkerViaDAI(buyer, node, text, 120).send({from:squatter, gas});
        const numberOfMarkers = await markerResolver.methods.numMarkers(node).call();
        assert.equal(numberOfMarkers, "1");
        const firstMarkerText = await markerResolver.methods.marker(node, 0).call();
        assert.equal(firstMarkerText, text);
    });

    it('can create a MarkerResolver and add a marker via DAI (approve and call)', async() => {
        const rootDomain = 'geo';
        const domainToOwn = ['myname', rootDomain];
        
        const registrar = await deployContract('FIFSRegistrar', ens.options.address, namehash.hash(rootDomain));

        await ens.methods.setSubnodeOwner(zero, web3.utils.sha3(rootDomain), registrar.options.address).send({from: owner, gas});
        await registrar.methods.register(web3.utils.sha3(domainToOwn[0]), squatter).send({from: squatter, gas});
        
        const node = namehash.hash(domainToOwn.join('.'));

        const registeredOwner = await ens.methods.owner(node).call();
        assert.equal(registeredOwner, squatter);

        const text = 'coffee for 1 DAI!';
        const dai = await deployContract('DAI');
        const markerResolver = await deployContract('MarkerResolver', ens.options.address, dai.options.address);
        await dai.methods.transfer(buyer, "1000000000000000000").send({from:owner,gas});
        const data = markerResolver.methods.addMarkerViaDAI(buyer, node, text, 120).encodeABI();
        await dai.methods.approveAndCall("1000000000000000000", markerResolver.options.address, data).send({from:buyer, gas});
        const numberOfMarkers = await markerResolver.methods.numMarkers(node).call();
        assert.equal(numberOfMarkers, "1");
        const firstMarkerText = await markerResolver.methods.marker(node, 0).call();
        assert.equal(firstMarkerText, text);
    });
});