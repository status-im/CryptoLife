import React, { PureComponent } from 'react'

export default class Leaderboard extends PureComponent {
  state = {
    txs: []
  }

  fetchTxs = async (address) => {
    // FIXME: avoid using http://cors-anywhere.herokuapp.com
    const url = `http://cors-anywhere.herokuapp.com/https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${address}`;
    const response = await fetch(url);
    const json = await response.json();
    this.setState({txs: json.result});
  }

  async componentDidMount() {
    this.fetchTxs(this.props.address);
  }

  render() {
    const TxsList = this.state.txs.map((tx) =>
      <div key={tx.hash}>
        <a href={`https://blockscout.com/eth/mainnet/tx/${tx.hash}`} target="_blank">
          {tx.hash}
        </a>
      </div>
    )
    return (
      <div>
        <div>Txs:</div>
        {TxsList}
      </div>
    )
  }
}
