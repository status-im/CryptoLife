import React, {Component} from 'react';
import Connect from '../views/Connect';
import Transfer from '../views/Transfer';
import EthereumIdentitySDK from 'universal-login-sdk';
import {providers, Wallet, Contract} from 'ethers';
import getLabel from '../utils';
import Clicker from '../../build/Clicker';
import ChainOfLifeController from '../chainoflife-controller';
const web3Abi = require('web3-eth-abi')


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {view: 'connect'};
    this.provider = new providers.JsonRpcProvider('http://localhost:18545');
    this.sdk = new EthereumIdentitySDK('http://localhost:3311', this.provider);
    this.clickerContractAddress = '0x87bB498DA0C18af128180b761680fb47D6FB365d';
    this.tokenContractAddress = '0x850437540FE07d02045f88cAe122Bc66B1BdE957';
    this.clickerContract = new Contract(
      this.clickerContractAddress,
      Clicker.interface,
      this.provider
    );

  }

  async update(event) {
    const {value} = event.target;
    this.setState({value});
  }

  onChange(event) {
    const {value} = event.target;
    this.setState({'to': value});
  }

  async onTransferClick() {

    const abi = this.clickerContract.interface.abi.find(n => n.name == 'setPress');
    const params = [12345]

    const message = {
      to: this.clickerContractAddress,
      from: this.identityAddress,
      value: 0,
      // data: this.clickerContract.interface.functions.press().data,
      data: web3Abi.encodeFunctionCall(abi, params),
      gasToken: this.tokenContractAddress,
      gasPrice: 110000000000000,
      gasLimit: 1000000

    };
    // console.log('this.clickerContract.interface', this.clickerContract.interface.abi.find(n => n.name == 'setPress'))
    // console.log('this.clickerContract.interface.functions.press()', this.clickerContract.interface.functions.press())
    // console.log('this.clickerContract.interface.functions.press().data', this.clickerContract.interface.functions.press().data)
    // console.log('this.clickerContract.interface.functions.setPress(uint256)', this.clickerContract.interface.functions['setPress(uint256)'])
    // console.log('this.clickerContract.interface.functions.setPress(uint256).data', this.clickerContract.interface.functions['setPress(uint256)'].data)
    // console.log('onTransferClick message=', message)
    const r = await this.sdk.execute(this.identityAddress, message, this.privateKey);
    // console.log('receipt', r)

    // this.subscription = this.sdk.subscribe('Executed', this.identityAddress, (event) => {
    //   console.log('EXECUTED', event)
    // });

    // this.sdk.blockchainObserver.subscribe('Executed', this.identityAddress, (event) => {
    //   console.log('EXECUTED!', event)
    // });
    // this.sdk.blockchainObserver.start()
  }

  async onNextClick() {
    const name = `${this.state.value}.chainoflife.eth`;
    const identityAddress = await this.sdk.identityExist(name);
    this.identityAddress = identityAddress;
    if (identityAddress) {
      const privateKey = await this.sdk.connect(identityAddress, await getLabel());
      this.privateKey = privateKey;
      // this.state.view == 'transfer';
      const {address} = new Wallet(privateKey);
      this.subscription = this.sdk.subscribe('KeyAdded', identityAddress, async (event) => {
        if (event.address === address) {
          this.setState({view: 'transfer'})

          this.chainoflifeController = new ChainOfLifeController({
            identityAddress: this.identityAddress,
            privateKey: this.privateKey
          });

          await this.chainoflifeController.register('0x00')
          console.log('registered!')

        };
      });
    } else {
      alert(`Identity ${name} does not exist.`);
    }
  }

  async componentDidMount() {
    await this.sdk.start();
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.sdk.stop();
  }

  render() {
    if (this.state.view == 'connect') {
      return (<Connect onChange={this.update.bind(this)} onNextClick={this.onNextClick.bind(this)}/>);
    } if (this.state.view == 'transfer') {
      return (<Transfer onChange={this.onChange.bind(this)} onClick={this.onTransferClick.bind(this)}/>);
    }
  }
}


export default App;
