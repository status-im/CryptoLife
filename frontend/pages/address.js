import React, { Component } from 'react'
import Web3 from 'web3'
import parse from 'domain-name-parser'

import NotAnAddress from '../components/NotAnAddress'

export default class Address extends Component {
  static async getInitialProps({ query }) {
    return query;
  }

  validateENSDomain(address) {
    const domain = parse(address);
    return domain.tld == 'eth';
  }

  validateAddreth(address) {
    const web3 = new Web3();
    return web3.utils.isAddress(address) || this.validateENSDomain(address);
  }

  render() {
    const isAddressValid = this.validateAddreth(this.props.address);
    return (
      <div>
        {this.props.address}
        <Leaderboard address={this.props.address}/>
        {!isAddressValid &&
          <NotAnAddress/>
        }
      </div>
    )
  }
}
