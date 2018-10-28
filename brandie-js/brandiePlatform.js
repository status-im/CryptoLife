const BaseContract = require('./baseContract');

const gasAmount = {
    createCompany: 200000,
    issueToken: 2000000
};

class BrandiePlatform extends BaseContract {

    createCompany(name, website, account) {
        return this.web3contract.methods.registerCompany(name, website).send({
            from: account,
            gas: gasAmount.createCompany
        })
    }

    issueToken(companyName, tokenName, tokenSymbol, tokenSupply, tokenTime, account) {
        return this.web3contract.methods.issueToken(
            companyName,
            tokenName,
            tokenSymbol,
            tokenSupply,
            tokenTime
        ).send({
            from: account,
            gas: gasAmount.issueToken
        });
    }

    getCompaniesForAccount(account) {
        return this.web3contract.methods.getCompanies(account).call()
    }

    getCompanyByNameHash(nameHash) {
        return this.web3contract.methods.companies(nameHash).call()
    }

    getAddressesOfTokens(companyName, address){
       return this.web3contract.methods.getAddressesOfTokens(companyName).call()
    }

    getTokenInformation(companyName, tokenAddress){
       return this.web3contract.methods.getTokenInformation(companyName, tokenAddress).call()
    }

}

module.exports = BrandiePlatform;