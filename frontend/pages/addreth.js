import React, { Component } from 'react'
import Web3 from 'web3'
import parse from 'domain-name-parser'
import styled from 'styled-components'

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

export default class Addreth extends Component {
  static async getInitialProps({ query }) {
    return query
  }

  validateENSDomain(addreth) {
    const domain = parse(addreth)
    return domain.tld == 'eth'
  }

  validateAddreth(addreth) {
    const web3 = new Web3()
    return web3.utils.isAddress(addreth) || this.validateENSDomain(addreth)
  }

  render() {
    const isAddrethValid = this.validateAddreth(this.props.addreth)
    return (
      <Container>
        <AddrethLink
          href={`https://blockscout.com/eth/mainnet/address/${
            this.props.addreth
          }`}
          target="_blank"
        >
          {this.props.addreth}
        </AddrethLink>
        <DonationForm address={this.props.addreth} donationNetworkID={4} />
        <LeaderboardContainer>
          <Leaderboard address={this.props.addreth} />
        </LeaderboardContainer>
        {!isAddrethValid && <NotAnAddreth />}
      </Container>
    )
  }
}
