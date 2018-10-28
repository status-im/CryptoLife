class BaseContract {

  constructor(web3, contractAbi, contractAddress) {
    this.contractAddress = contractAddress;
    this.web3contract = new web3.eth.Contract(contractAbi, contractAddress);
    this.web3 = web3;
    this.events = this.web3contract.events;
  }

}

module.exports = BaseContract;