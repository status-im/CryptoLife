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
  const contract = new web3.eth.Contract(colAbi.abi, '0x242f41e39edaed739e7215490125288a4dfbcdef');
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
