import React, { Component } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import IPFS from 'ipfs-mini'
import parse from 'domain-name-parser'
import axios from 'axios'
import abiDecoder from 'abi-decoder'

import Leaderboard from '../components/Leaderboard'
import DonationForm from '../components/DonationForm'
import NotAnAddreth from '../components/NotAnAddreth'

const Container = styled.div`
  max-width: 100vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-content: center;
  padding: 2rem;
  min-height: 100vh;

  background: linear-gradient(180deg, #6200ee 0%, rgba(98, 0, 238, 0.49) 100%),
    #c4c4c4;

  @media (max-width: 640px) {
    width: 100vw;
    grid-template-columns: (auto-fit, 1fr);
  }
`
const LeaderboardContainer = styled.div`
  display: grid;
  grid-column: 1 / span 2;
`

const AddrethLink = styled.a`
  word-wrap: wrap;
  color: #03dac6;
  font-weight: 100;
  font-size: 1.5rem;
  text-decoration: none;
`

const Wrapper = styled.div`
  padding: 0 2rem;
  min-height: 100vh;
  background: linear-gradient(180deg, #6200ee 0%, rgba(98, 0, 238, 0.49) 100%),
    #c4c4c4;
`

const Navbar = styled.div`
  height: 4rem;
  color: white;
  background-color: black;
  display: flex;
  align-items: center;
`

const Brand = styled.img`
  height: 50%;
  margin-left: 1rem;
  margin-right: 1rem;
`

const Title = styled.h1`
  color: #03dac6;
  font-weight: 300;
`

const ContentWrapper = styled.div`
  margin-bottom: 4rem;
`

const localWeb3 = new Web3()

export default class Addreth extends Component {
  static async getInitialProps({ query }) {
    return query
  }

  state = {
    metamaskAvailable: false,
    account: null,
    claimed: false,
    editTitle: false,
    titleValue: '',
    editDescription: false,
    descriptionValue: '',
  }

  constructor() {
    super()
    this.ipfs = new IPFS({
      host: 'ipfs.web3.party',
      port: 5001,
      protocol: 'https',
    })
    this.abi = [
      {
        constant: false,
        inputs: [
          {
            name: '_ipfsHash',
            type: 'string',
          },
        ],
        name: 'saveEth',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ]
    abiDecoder.addABI(this.abi)
  }

  componentDidMount() {
    this.initMetaMask()
    this.findAddress(this.props.addreth)
  }

  validateENSDomain(addreth) {
    const domain = parse(addreth)
    return domain.tld == 'eth'
  }

  validateAddreth(addreth) {
    return localWeb3.utils.isAddress(addreth) || this.validateENSDomain(addreth)
  }

  initMetaMask = () => {
    /*eslint-disable no-undef*/
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        this.web3 = window.web3
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.getAccounts().then(a => {
            this.setState({
              metamaskAvailable: true,
              account: a[0].toLowerCase(),
            })
          })

          web3.currentProvider.publicConfigStore.on('update', res => {
            console.log('web3 updated..', res)
            this.setState({
              metamaskAvailable: true,
              account: res.selectedAddress.toLowerCase(),
            })
          })
        } catch (error) {
          this.setState({
            metamaskAvailable: false,
          })
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        this.web3 = window.web3

        // Acccounts always exposed
        web3.eth.getAccounts().then(a => {
          console.log(a)
          this.setState({
            metamaskAvailable: true,
            account: a[0].toLowerCase(),
          })
        })

        web3.currentProvider.publicConfigStore.on('update', res => {
          console.log('web3 updated..', res)
          this.setState({
            metamaskAvailable: true,
            account: res.selectedAddress.toLowerCase(),
          })
        })
      }
      // Non-dapp browsers...
      else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
        this.setState({ metamaskAvailable: false })
      }
    })
    /*eslint-enable no-undef*/
  }

  handleTitle = e => {
    this.setState({ titleValue: e.target.value })
    if (e.keyCode === 13) {
      this.setState({ editTitle: false })
    }
  }

  handleDescription = e => {
    this.setState({ descriptionValue: e.target.value })
    if (e.keyCode === 13) {
      this.setState({
        editDescription: false,
      })
    }
  }

  // save data on IPFS & send transaction immediately
  saveData = () => {
    this.setState({
      editDescription: false,
      editTitle: false,
    })
    return new Promise((resolve, reject) => {
      const msgParams = this.makeData()
      this.ipfs.addJSON({ payload: msgParams }, (err, result) => {
        resolve(result)
        const myContract = new this.web3.eth.Contract(
          this.abi,
          '0xf7d934776da4d1734f36d86002de36954d7dd528',
          {
            from: this.state.account,
          }
        )
        myContract.methods.saveEth(result).send((err, tx) => {
          if (err) {
            return reject(err)
          }
          resolve(tx)
        })
      })
    })
  }

  makeData = () => {
    const msgParams = [
      {
        type: 'string',
        name: 'title',
        value: this.state.titleValue,
      },
      {
        type: 'string',
        name: 'description',
        value: this.state.descriptionValue,
      },
    ]
    return msgParams
  }

  findAddress(address) {
    const bs = `https://ipfs.web3.party:5001/corsproxy?module=account&action=txlist&address=${address}`
    axios
      .get(bs, {
        headers: {
          Authorization: '',
          'Target-URL': 'https://blockscout.com/eth/ropsten/api',
        },
      })
      .then(response => {
        // handle success
        console.log(response)

        if (response.data && response.data.status === '1') {
          response.data.result.sort(function(a, b) {
            return parseInt(a.nonce) - parseInt(b.nonce)
          })
          let newestHash = ''
          for (let i = 0; i < response.data.result.length; i++) {
            var t = response.data.result[i]
            if (t.contractAddress == '' && t.from == address.toLowerCase()) {
              const decodedData = abiDecoder.decodeMethod(t.input)

              if (decodedData.name == 'saveEth') {
                const hash = decodedData.params.find(element => {
                  return element.name === '_ipfsHash'
                }).value
                newestHash = hash
              }
            }
          }

          this.ipfs.catJSON(newestHash, (err, result) => {
            if (err) {
              console.log(err)
            }
            let arrayToObject = result.payload.reduce((acc, cur) => {
              acc[cur.name] = cur.value
              return acc
            }, {})
            this.setState({ ipfsPayload: arrayToObject })
          })
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error)
      })
  }

  render() {
    const { addreth } = this.props
    const {
      account,
      claimed,
      editTitle,
      titleValue,
      editDescription,
      descriptionValue,
      ipfsPayload,
    } = this.state

    console.log(this.state)

    return (
      <div>
        <Navbar>
          <Brand src="../static/images/brand.svg" />
          <p>{addreth}</p>
          {this.validateENSDomain(addreth) && (
            <>
              <Brand src="../static/images/ens.svg" />
              <p>{addreth}</p>
            </>
          )}
        </Navbar>
        <Container>
          <div>
            <Title>{addreth}</Title>
            {claimed && (
              <ContentWrapper>
                <p>You've already claimed this page!</p>
                {editTitle ? (
                  <input
                    type="text"
                    onChange={this.handleTitle}
                    onKeyDown={this.handleTitle}
                    defaultValue={titleValue}
                  />
                ) : (
                  <h1 onClick={() => this.setState({ editTitle: true })}>
                    {(ipfsPayload && ipfsPayload.title) ||
                      titleValue ||
                      'Add a title..'}
                  </h1>
                )}
                {editDescription ? (
                  <textarea
                    onKeyDown={this.handleDescription}
                    defaultValue={descriptionValue}
                  />
                ) : (
                  <p onClick={() => this.setState({ editDescription: true })}>
                    {(ipfsPayload && ipfsPayload.description) ||
                      descriptionValue ||
                      'Add a description..'}
                  </p>
                )}
                {claimed && <button onClick={this.saveData}>Save page</button>}
              </ContentWrapper>
            )}
            {addreth.toLowerCase() === account &&
              !claimed && (
                <>
                  <p>This address has not been claimed yet!</p>
                  <button onClick={() => this.setState({ claimed: true })}>
                    Claim now!
                  </button>
                </>
              )}
          </div>
          <a
            href={`https://blockscout.com/eth/mainnet/address/${addreth}`}
            target="_blank"
          >
            {addreth}
          </a>
          <DonationForm address={this.props.addreth} donationNetworkID={4} />
          <LeaderboardContainer>
            <Leaderboard address={this.props.addreth} />
          </LeaderboardContainer>
          {!this.validateAddreth(addreth) && <NotAnAddreth />}
        </Container>
      </div>
    )
  }
}
