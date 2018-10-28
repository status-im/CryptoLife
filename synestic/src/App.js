import React, { Component } from 'react';
import { Web3Provider } from 'react-web3'; // crappy lil' package
import Router from './Router'

import './App.css';

class App extends Component {
  render() {
    return (
      <Web3Provider>
        <Router />
      </Web3Provider>
    );
  }
}

export default App;
