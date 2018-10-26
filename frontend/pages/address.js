import React, { Component } from 'react'
import Web3 from 'web3'

import NotAnAddress from '../components/NotAnAddress'

export default class Address extends Component {
  static async getInitialProps({ query }) {
    return query;
  }

  render() {
    const web3 = new Web3();
    const isAddressValid = web3.utils.isAddress(this.props.address);
    return (
      <div>
        {this.props.address}
        {!isAddressValid &&
          <NotAnAddress/>
        }
      </div>
    )
  }
}
