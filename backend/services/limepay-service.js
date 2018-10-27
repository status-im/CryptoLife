const axios = require('axios');
const ethers = require('ethers');


const LIME_PAY_CONFIG = require("./../config/limepay");

const PAYMENT_URL = LIME_PAY_CONFIG.BASE_URL + "v1/payments";
const API_KEY = LIME_PAY_CONFIG.API_KEY;
const API_SECRET = LIME_PAY_CONFIG.SECRET;

const GAS_LIMIT = "4700000";
const TOTAL_GAS_REQUIRED = ethers.utils.bigNumberify("60000000000000000"); // TODO Required gas for approve + buy

const DAI_TOKEN = "0xe5ffE51Cdc233702fD09810B467293161f83562b";
const DETSY_ADDRESS = "0xe5ffE51Cdc233702fD09810B467293161f83562b";  // TODO Contract from Kris

const GAS_STATION_URL = "https://ethgasstation.info/json/ethgasAPI.json";

class LimePayService {

    constructor() {
        if (!LimePayService.instance) {
            LimePayService.instance = this;
        }
        return LimePayService.instance;
    }

    async createPayment(shopperID, itemName, itemPrice, tokenAmount) {

        let gasPrice = await getGasPrice();

        let itemData = { name: itemName, price: itemPrice };
        let data = buildRequestData(shopperID, itemData, tokenAmount, gasPrice);

        try {
            let result = await axios({
                method: "POST",
                url: PAYMENT_URL,
                headers: buildHeaders(),
                data: data
            });
            return result.headers["x-lime-token"];
        } catch (error) {
            console.log(`An error occured while creating payment.Details:\n ${JSON.stringify(error.response.data)}`);
            throw error;
        }
    }

}

let limePayService = new LimePayService();
module.exports = limePayService;

let buildRequestData = function (shopperID, item, tokenAmount, gasPrice) {
    let data = {};
    data.currency = "EUR";
    data.shopper = shopperID;

    data.items = [{ description: item.name, lineAmount: item.price, quantity: 1 }];

    let weiAmount = TOTAL_GAS_REQUIRED.mul(gasPrice).toString(); // TODO 
    data.fundTxData = { tokenAmount, weiAmount };

    data.genericTransactions = [];
    data.genericTransactions[0] = { gasPrice: gasPrice.toString(), gasLimit: GAS_LIMIT, to: DAI_TOKEN, functionName: "approve" };
    data.genericTransactions[1] = { gasPrice: gasPrice.toString(), gasLimit: GAS_LIMIT, to: DETSY_ADDRESS, functionName: "buyItem" };

    return data;
}

let buildHeaders = function () {
    return {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Authorization": "Basic " + Buffer.from(API_KEY + ":" + API_SECRET).toString('base64')
    }
}

let getGasPrice = async function () {
    var price = await axios.get(GAS_STATION_URL);
    var parsedPrice = ethers.utils.parseUnits((price.data.fast / 10).toString(10), 'gwei');

    return parsedPrice;
}

