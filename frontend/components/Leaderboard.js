import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import Emojify from 'react-emojione'
import axios from 'axios';

const LeaderboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`

const TxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 3fr 1fr;
  grid-gap: 1rem;
`

const TxLink = styled.a`
  color: #ff9a62;
  text-decoration: none;
`
const TxLinkContainer = styled.div`
  max-width: 200px;
`

// const AmountDonated = props => {
//   return <div>Total amount collected: {props.amount}</div>
// }

export default class Leaderboard extends PureComponent {
  state = {
    txs: [],
    totalAmount: 0,
  }

  fetchTxs = async address => {

    const bs = `https://ipfs.web3.party:5001/corsproxy?module=account&action=txlist&address=${address}`
    const json =  await axios
      .get(bs, {
        headers: {
          Authorization: '',
          'Target-URL': 'https://blockscout.com/eth/ropsten/api',
        },
      })
//debugger;

    // // FIXME: avoid using http://cors-anywhere.herokuapp.com
    // const url = `https://blockscout.com/eth/ropsten/api?module=account&action=txlist&address=${address}`
    // const response = await fetch(url)
    // const json = await response.json()
    return this.processTxList(json.data.result);
  }

  processTxList = ethlist => {
    debugger;
    let myweb3 = new Web3(web3.currentProvider)
    let filteredEthList = ethlist
      .map(obj => {
        obj.value = new myweb3.utils.BN(obj.value) // convert string to BigNumber
        return obj
      })
      .filter(obj => {
        return obj.value.cmp(new myweb3.utils.BN(0))
      }) // filter out zero-value transactions
      .reduce((acc, cur) => {
        // group by address and sum tx value
        if (cur.isError !== '0') {
          // tx was not successful - skip it.
          return acc
        }
        if (cur.from == this.props.address) {
          // tx was outgoing - don't add it in
          return acc
        }
        if (typeof acc[cur.from] === 'undefined') {
          acc[cur.from] = {
            from: cur.from,
            value: new myweb3.utils.BN(0),
            input: cur.input,
            hash: [],
          }
        }
        acc[cur.from].value = cur.value.add(acc[cur.from].value)
        acc[cur.from].input =
          cur.input !== '0x' && cur.input !== '0x00'
            ? myweb3.utils.hexToAscii(cur.input)
            : acc[cur.from].input
        acc[cur.from].hash.push(cur.hash)
        return acc
      }, {})
    filteredEthList = Object.keys(filteredEthList)
      .map(val => filteredEthList[val])
      .sort((a, b) => {
        // sort greatest to least
        return b.value.cmp(a.value)
      })
      .map((obj, index) => {
        // add rank
        obj.rank = index + 1
        return obj
      })
    const ethTotal = filteredEthList.reduce((acc, cur) => {
      return acc.add(cur.value)
    }, new myweb3.utils.BN(0))
    filteredEthList = filteredEthList.map(obj => {
      obj.value = parseFloat(myweb3.utils.fromWei(obj.value)).toFixed(2)
      return obj
    })
    return this.setState({
      txs: filteredEthList,
      totalAmount: parseFloat(myweb3.utils.fromWei(ethTotal)).toFixed(2),
    })
  }

  componentDidMount = async () => {
    this.fetchTxs(this.props.address)
  }

  render() {
    if (this.state.txs) {
      const TxsList = this.state.txs.map(tx => (
        <React.Fragment key={tx.from}>
          <span>{tx.rank}</span>
          <span>{tx.from}</span>
          <span>{tx.value} ETH</span>
          <span>
            <Emojify>{tx.input}</Emojify>
          </span>
          <TxLinkContainer>
            {tx.hash.map((hash, index) => (
              <TxLink
                key={hash}
                href={`https://blockscout.com/eth/ropsten/tx/${hash}`}
                target="_blank"
              >
                [{index + 1}]
              </TxLink>
            ))}
          </TxLinkContainer>
        </React.Fragment>
      ))
      return (
        <LeaderboardContainer>
          <AmountDonated amount={this.state.totalAmount} />
          <TxGrid>
            <span>Rank</span>
            <span>From</span>
            <span>Value</span>
            <span>Message</span>
            <span>Tx</span>
            {TxsList}
          </TxGrid>
        </LeaderboardContainer>
      )
    } else {
      return <div />
    }
  }
}
