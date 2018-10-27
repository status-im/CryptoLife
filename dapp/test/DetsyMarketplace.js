const etherlime = require('etherlime');
const utils = require("./utils");

const DetsyMarketplace = require('../build/DetsyMarketplace.json');
const DAIToken = require('../build/DAIToken.json');


describe('Deploy', () => {
    let owner = accounts[0];
    let deployer;

    beforeEach(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);
    });

    it('should set correct owner', async () => {
        const tokenContractDeployed = await deployer.deploy(DAIToken, {});
        const daiToken = tokenContractDeployed.contract;

        const detsyMarketplaceWrapper = await deployer.deploy(DetsyMarketplace, {}, daiToken.address);
        const detsyMarketplaceInstance = detsyMarketplaceWrapper.contract;

        let _owner = await detsyMarketplaceInstance.owner();


        assert.strictEqual(_owner, owner.wallet.address, 'Initial contract owner does not match');
    });
});

describe('List item', () => {
    let owner = accounts[0];
    let deployer;

    let ipfsHash = utils.getBytes32FromIpfsHash("QmccGXmAZTJbYoUMbZxCTakxopFMeuTWyYJe7G4GpGxYCP");
    let ipfsHashNew = utils.getBytes32FromIpfsHash("QmccGXmAZTJbYoUMbZxCTakxopFMeuTWyYJe7G4GpGxYCT");
    let itemPrice = 33;
    let quantity = 15;

    let detsyMarketplaceInstance;
    let daiToken;

    beforeEach(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);

        const tokenContractDeployed = await deployer.deploy(DAIToken, {});
        daiToken = tokenContractDeployed.contract;

        const detsyMarketplaceWrapper = await deployer.deploy(DetsyMarketplace, {}, daiToken.address);
        detsyMarketplaceInstance = detsyMarketplaceWrapper.contract;


    });

    it('should list item', async () => {
        let itemsCountOld = await detsyMarketplaceInstance.getItemsCount();

        await detsyMarketplaceInstance.listItem(ipfsHash, itemPrice, quantity);

        let itemsCount = await detsyMarketplaceInstance.getItemsCount();
        assert.strictEqual(itemsCountOld.toNumber() + 1, itemsCount.toNumber(), 'The items count has not been increased!');
    });

    it('should list item with correct values', async () => {
        await detsyMarketplaceInstance.listItem(ipfsHash, itemPrice, quantity);
        await detsyMarketplaceInstance.listItem(ipfsHashNew, itemPrice, quantity);

        let item = await detsyMarketplaceInstance.getItem(ipfsHashNew);

        assert.strictEqual(item._seller, owner.wallet.address, 'The item seller is not correct');
        assert.strictEqual(item._price.toNumber(), itemPrice, 'The item price is not correct');
        assert.strictEqual(item._quantity.toNumber(), quantity, 'The item quantity is not correct');
        assert.strictEqual(item._index.toNumber(), 1, 'The item index is not correct');
    });
});

describe('Buy item', () => {
    let owner = accounts[0];
    let deployer;

    let ipfsHash = utils.getBytes32FromIpfsHash("QmccGXmAZTJbYoUMbZxCTakxopFMeuTWyYJe7G4GpGxYCP");
    let ipfsHashNew = utils.getBytes32FromIpfsHash("QmccGXmAZTJbYoUMbZxCTakxopFMeuTWyYJe7G4GpGxYCT");
    let itemPrice = 1500;
    let quantity = 15;
    let quantityToBuy = 2;

    let detsyMarketplaceInstance;
    let daiToken;

    beforeEach(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);

        const tokenContractDeployed = await deployer.deploy(DAIToken, {});
        daiToken = tokenContractDeployed.contract;

        const detsyMarketplaceWrapper = await deployer.deploy(DetsyMarketplace, {}, daiToken.address);
        detsyMarketplaceInstance = detsyMarketplaceWrapper.contract;
        console.log(ipfsHash);
        await detsyMarketplaceInstance.listItem(ipfsHash, itemPrice, quantity);
        await detsyMarketplaceInstance.listItem(ipfsHashNew, itemPrice, quantity);

        await daiToken.approve(detsyMarketplaceInstance.address, itemPrice * quantityToBuy);
    });

    it('should buy item', async () => {

        await detsyMarketplaceInstance.buyItem(ipfsHashNew, quantityToBuy);

        let item = await detsyMarketplaceInstance.getItem(ipfsHashNew);

        assert.strictEqual(item._quantity.toNumber(), quantity - quantityToBuy, 'The item quantity is not correct');
    });

    it('should buy item and collect detsy fee', async () => {

        await detsyMarketplaceInstance.buyItem(ipfsHashNew, quantityToBuy);

        let feeToCollectPercent = await detsyMarketplaceInstance.detsyFeePercent();
        let feeToCollect = ((itemPrice * quantityToBuy) * feeToCollectPercent.toNumber()) / 100;
        let contractFeeBalance = await daiToken.balanceOf(detsyMarketplaceInstance.address);

        assert.strictEqual(feeToCollect, contractFeeBalance.toNumber(), 'The collected fee is not correct');
    });

    it('should buy item and pay the correct price', async () => {
        let buyerBalanceOld = await daiToken.balanceOf(owner.wallet.address);

        await detsyMarketplaceInstance.buyItem(ipfsHashNew, quantityToBuy);

        let buyerBalanceAfter = await daiToken.balanceOf(owner.wallet.address);
        let priceToPay = (itemPrice * quantityToBuy);

        let feeToCollectPercent = await detsyMarketplaceInstance.detsyFeePercent();
        let feeToCollect = ((itemPrice * quantityToBuy) * feeToCollectPercent.toNumber()) / 100;

        priceToPay -= feeToCollect;

        assert.strictEqual(buyerBalanceOld.toString(), buyerBalanceAfter.add(feeToCollect).toString(), 'The collected tokens are not correct');
    });
});