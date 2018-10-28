const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const jsonData = require("../data.json");

const BrandiePlatform = new web3.eth.Contract(jsonData['brandie_platform_abi'], jsonData['brandie_platform_address']);


let name1 = "Nike";
let website1 = "nike.com";
let tokenName1 = "Nike Unique Token";
let tokenSymbol1 = "NUT";

let name2 = "Adidas";
let website2 = "adidas.com";
let tokenName2 = "Adidas Unique Token";
let tokenSymbol2 = "AUT";

async function createCompany(name, website, account) {
    let res = await BrandiePlatform.methods.registerCompany(name, website).send({from: account, gas: 8000000});
    console.log(res);
}

async function issueToken(companyName, tokenName, tokenSymbol, tokenSupply, tokenTime, account) {
    let res = await BrandiePlatform.methods.issueToken(companyName, tokenName, tokenSymbol, tokenSupply, tokenTime).send({from: account, gas: 8000000});
    console.log(res);
}

async function run() {
    console.log("Start");
    let acc = "0x49c1938d501418a15abedf920de8025e0da3a09b";
    await createCompany(name1, website1, acc);
    await issueToken(name1, tokenName1, tokenSymbol1, 0, 0, acc);
}

run();
