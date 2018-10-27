import React, { Component } from 'react'
import Web3 from 'web3'
import IPFS from 'ipfs-mini'
import styled from 'styled-components'
import Button from '../components/button'

const Container = styled.div`
  max-width: 100vw;
  @media (max-width: 640px) {
    height: 100vh;
    width: 100vw;
  }
`

const Content = styled.nav`
  margin: 0 auto;
  max-width: 920px;
  display: grid;
  grid-template-columns: (auto-fit, 1fr);
  grid-gap: 1rem;
`

const StyledInput = styled.input`
  border: 1px solid white;
  border-radius: 3px;
  padding-left: 0.25rem;
  width: 100%;
  font-size: 20px;
  &:focus {
    outline: none;
  }
`

const Addreth = styled.h1`
  word-wrap: wrap;
  color: #03dac6;
  font-weight: 100;
`

const Spannet = styled.span``

export default class MetamaskSigner extends Component {
  constructor(props) {
    super(props)
    this.state = { account: null }
    this.signData = this.signData.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.setTitle = this.setTitle.bind(this)

    this.ipfs = new IPFS({
      host: 'ipfs.web3.party',
      port: 5001,
      protocol: 'https',
    })
  }

  componentDidMount() {
    /*eslint-disable no-undef*/
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.getAccounts().then(a => {
            console.log(a)
            this.setState({ account: a[0] })
          })

          web3.currentProvider.publicConfigStore.on('update', res => {
            console.log('web3 updated..', res)
            this.setState({ account: res.selectedAddress })
          })

          // web3.eth.sendTransaction({/* ... */});
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.getAccounts().then(a => {
          console.log(a)
          this.setState({ account: a[0] })
        })

        web3.currentProvider.publicConfigStore.on('update', res => {
          console.log('web3 updated..', res)
          this.setState({ account: res.selectedAddress })
        })
      }
      // Non-dapp browsers...
      else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    })
    /*eslint-enable no-undef*/
  }

  signData() {
    const msgParams = [
      {
        type: 'string',
        name: 'Claimed Address',
        value: this.state.account,
      },
      {
        type: 'string',
        name: 'Title',
        value: this.state.title,
      },
      {
        type: 'string',
        name: 'Description',
        value: this.state.description,
      },
    ]

    this.signMsg(msgParams, this.state.account).then(res => {
      const msg = {
        payload: msgParams,
        signature: res,
      }

      this.ipfs.addJSON(msg, (err, result) => {
        console.log(err, result)
      })
    })
  }

  setDescription(e) {
    this.setState({ description: e.target.value })
  }

  setTitle(e) {
    this.setState({ title: e.target.value })
  }

  signMsg(msgParams, from) {
    /*eslint-disable no-undef*/
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData',
          params: [msgParams, from],
          from: from,
        },
        function(err, result) {
          if (err) return console.error(err)
          if (result.error) {
            return console.error(result.error.message)
          }
          return resolve(result.result)
          //   const recovered = sigUtil.recoverTypedSignature({
          //     data: msgParams,
          //     sig: result.result
          //   })
          //   if (recovered === from ) {
          //     alert('Recovered signer: ' + from)
          //   } else {
          //     alert('Failed to verify signer, got: ' + result)
          //   }
        }
      )
    })
    /*eslint-enable no-undef*/
  }

  render() {
    return (
      <Container>
        {this.state.account && (
          <Content>
            <Spannet>
              Claiming
              <Addreth>{this.state.account}</Addreth>
            </Spannet>

            <Spannet>Title for this address</Spannet>
            <StyledInput
              type="text"
              placeholder="My Title"
              onChange={this.setTitle}
            />

            <Spannet>Description for this address</Spannet>
            <StyledInput
              type="text"
              placeholder="AddrETH Purpose"
              onChange={this.setDescription}
            />

            <Button primary onClick={this.signData} type="button">
              SIGN THAT
            </Button>
          </Content>
        )}
      </Container>
    )
  }
}
