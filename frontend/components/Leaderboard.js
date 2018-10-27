import React, { PureComponent } from 'react'
import styled from 'styled-components'

const TxWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
`
const TxLink = styled.a`
  color: #ff9a62;
  text-decoration: none;
`

export default class Leaderboard extends PureComponent {
  state = {
    txs: [],
  }

  fetchTxs = async address => {
    // FIXME: avoid using http://cors-anywhere.herokuapp.com
    const url = `http://cors-anywhere.herokuapp.com/https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${address}`
    const response = await fetch(url)
    const json = await response.json()
    this.setState({ txs: json.result })
  }

  async componentDidMount() {
    this.fetchTxs(this.props.address)
  }

  render() {
    const TxsList = this.state.txs.map(tx => (
      <TxWrapper key={tx.hash}>
        <TxLink
          href={`https://blockscout.com/eth/mainnet/tx/${tx.hash}`}
          target="_blank"
        >
          {tx.hash}
        </TxLink>
      </TxWrapper>
    ))
    return (
      <TxWrapper>
        <TxWrapper>Txs:</TxWrapper>
        {TxsList}
      </TxWrapper>
    )
  }
}
