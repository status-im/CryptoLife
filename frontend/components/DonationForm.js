import React, { PureComponent } from 'react'
import Web3 from 'web3'
import styled from 'styled-components'

import Button from '../components/Button'

const Container = styled.div`
  display: grid;
  color: white;
  grid-template-columns: (auto-fill, 1fr);
`

const TransactionContainer = styled.div`
  align-content: center;
`

const TransactionForm = styled.form`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 0.7rem;
  padding: 1rem;
`

const Input = styled.input`
  border-radius: 0.2rem;
  padding: 0.3rem;
`

export default class DonationForm extends PureComponent {
  constructor(props) {
    super()
    this.state = {
      netId: 3,
      thanks: false,
    }
  }

  handleDonate = event => {
    event.preventDefault()
    const form = event.target
    let myweb3 = window.web3
    let donateWei = new myweb3.utils.BN(
      myweb3.utils.toWei(form.elements['amount'].value, 'ether')
    )
    let message = myweb3.utils.toHex(form.elements['message'].value)
    let extraGasNeeded = form.elements['message'].value.length * 68
    if (this.state.netId === this.props.donationNetworkID) {
      return myweb3.eth.getAccounts().then(accounts => {
        return myweb3.eth
          .sendTransaction(
            {
              from: accounts[0],
              to: this.props.address,
              value: donateWei,
              gas: 150000 + extraGasNeeded,
              data: message,
            },
            (err, hash) => {
              //debugger;
              console.log('tx hash', hash)
              form.elements['message'].value = ''
              form.elements['amount'].value = ''
              this.setState({
                thanks: true,
                donateenabled: true,
              })
            }
          )
          .catch(e => {
            console.log(e)
          })
      })
    } else {
      console.log('no donation allowed on this network')
      this.setState({
        thanks: true,
        donateenabled: false,
      })
    }
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
      if (window.web3) {
        window.web3.eth.net.getId().then(netId => {
          this.setState({ netId: netId })
          switch (netId) {
            case 1:
              console.log('Metamask is on mainnet')
              break
            case 2:
              console.log('Metamask is on the deprecated Morden test network.')
              break
            case 3:
              console.log('Metamask is on the ropsten test network.')
              break
            case 4:
              console.log('Metamask is on the Rinkeby test network.')
              break
            case 42:
              console.log('Metamask is on the Kovan test network.')
              break
            default:
              console.log('Metamask is on an unknown network.')
          }
        })
      }
      /*eslint-enable no-undef*/
    })
  }

  render() {
    const candonate = true
    return (
      <Container>
        {/* <img src="/img/ways-to-donate.svg" className="typelogo img-fluid" /> */}
        {candonate ? (
          <TransactionContainer>
            <h4>Send a transaction via Metamask to this address: </h4>
            <TransactionForm onSubmit={this.handleDonate}>
              <Input type="text" placeholder="ETH to send" name="amount" />
              <Input type="text" placeholder="message" name="message" />
              <Button primary>Send</Button>
            </TransactionForm>
          </TransactionContainer>
        ) : (
          <br />
        )}
        {/* <img src="/img/placeholder-qr.svg" className="qr-code" /> */}
        {this.state.thanks && <div>WELL THANKS BUDDY</div>}
      </Container>
    )
  }
}
