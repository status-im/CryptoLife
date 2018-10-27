import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'

import colAbi from './abis/ChainOfLife';
import getWeb3 from './util/getWeb3';

const start = async () => {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(colAbi.abi, '0xce4b7c5f875df3ab9e2e7b88c85f55a8b172a544');
  const eventEmitter = await contract.events.allEvents();
  const eth = {
    web3: web3,
    contract: contract,
    eventEmitter: eventEmitter
  }
  ReactDOM.render((
    <BrowserRouter>
      <App eth={eth}/>
    </BrowserRouter>
  ), document.getElementById('root'));
  serviceWorker.unregister();
}
start();
