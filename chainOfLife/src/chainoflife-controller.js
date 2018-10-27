

import ChainOfLife from '../build/ChainOfLife';
import {providers, Contract} from 'ethers';
import EthereumIdentitySDK from 'universal-login-sdk';
const web3Abi = require('web3-eth-abi');

class ChainOfLifeController {

    constructor(opts) {
        this.privateKey = opts.privateKey;
        this.identityAddress = opts.identityAddress;

        this.tokenContractAddress = '0x850437540FE07d02045f88cAe122Bc66B1BdE957';
        this.provider = new providers.JsonRpcProvider('http://localhost:18545');
        this.chainOfLifeContractAddress = '0x3D0f39Fc4d5A44a59fBe624D0a3dEb25A8fBe728' //opts.chainOfLifeContractAddress;
        this.chainOfLifeContract = new Contract(
            this.chainOfLifeContractAddress,
            ChainOfLife.interface,
            this.provider
        );
        this.sdk = new EthereumIdentitySDK('http://localhost:3311', this.provider);
    }

    async executeMessage(methodName, params, value = 0) {
        const abi = this.chainOfLifeContract.interface.abi.find(n => n.name == methodName);

        const message = {
            to: this.chainOfLifeContractAddress,
            from: this.identityAddress,
            value: value,
            data: web3Abi.encodeFunctionCall(abi, params),
            gasToken: this.tokenContractAddress,
            gasPrice: 110000000000000,
            gasLimit: 1000000
        };

        await this.sdk.execute(this.identityAddress, message, this.privateKey);
    }

    async register(_hash) {
        await this.executeMessage('register', [_hash])
    }
}

export default ChainOfLifeController