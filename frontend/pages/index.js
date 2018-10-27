import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import styledNormalize from 'styled-normalize'
import Head from 'next/head'
import Web3 from 'web3'
import parseDomain from 'domain-name-parser'

import { Router, Link } from '../routes'

import SearchBar from '../components/SearchBar'
import Button from '../components/Button'

const web3 = new Web3()

injectGlobal`
  ${styledNormalize}
  body {
    line-height: 1.5;
    background-color: black;
  }
  html {
    box-sizing: border-box;
    overflow-wrap: break-word;
    margin: 0;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    overflow-wrap: break-word;
    margin: 0;
    font-family: 'Roboto Mono', monospace;
  }
`

const Container = styled.div`
  background: url('static/images/bg.jpeg') no-repeat;
  background-size: cover;
  height: 150vh;
  max-width: 100vw;
  display: grid;
  grid-template-column: (auto-fit, 1fr);

  @media (max-width: 640px) {
    height: 100vh;
    width: 100vw;
  }
`

const Content = styled.nav`
  margin: 0 auto;
  max-width: 920px;
`

const Navigation = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: center;
  height: 4rem;
`

const NavLink = styled.a`
  text-transform: uppercase;
  font-size: 22px;
  font-weight: 600;
  opacity: 0.7;
  padding: 2rem;
  justify-self: center;
`

const Brand = styled.img`
  padding-top: 3rem;
  width: 100%;
`

const Version = styled.div`
  font-size: 48px;
  opacity: 0.3;
  float: right;
  margin-top: -2rem;
`

const SearchWrapper = styled.div`
  display: grid;
  justify-content: center;
  width: 100%;
  grid-gap: 1rem;
`

const MainSection = styled.div`
  display: grid;
  background-color: rgba(0, 0, 0, 0.8);
  transform: skew(0deg, -10deg);
  grid-template-columns: 1fr 1fr;
  width: 100%;
  position: absolute;
  top: 80vh;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const SubHeadline = styled.h1`
  padding: 1rem;
  color: white;
  font-size: 3rem;
  font-weight: 300;
`

const Teaser = styled.p`
  padding: 3rem;
  padding-top: 5rem;
  color: white;
  justify-self: end;
  transform: skew(0deg, 10deg);
`

const TeaserText = styled.img`
width = 300px;`

const validateInput = input =>
  web3.utils.isAddress(input) || parseDomain(input).tld === 'eth'

const alerting = () =>
  alert('Please enter a valid ENS name or Ethereum address')

class App extends Component {
  state = {
    inputValue: '',
  }

  searchHandler = e => {
    const value = e.target.value

    if (validateInput(value)) {
      if (e.keyCode === 13) {
        Router.push(`/address/${value}`)
      }
      this.setState({ inputValue: value })
    } else if (e.keyCode === 13) {
      alerting()
    }
  }

  render() {
    const { inputValue } = this.state
    return (
      <Container>
        <Head>
          <title>AddrETH</title>
        </Head>
        <Content>
          <Navigation>
            <NavLink>Claim</NavLink>
            <NavLink>Search</NavLink>
            <NavLink>Create</NavLink>
          </Navigation>
          <Brand src="static/images/brand.svg" />
          <Version>v0.1</Version>
          <SearchWrapper>
            <SearchBar
              id="search"
              onChange={this.searchHandler}
              onKeyDown={this.searchHandler}
            />
            <Button
              primary
              onClick={() =>
                validateInput(inputValue)
                  ? Router.push(`/address/${inputValue}`)
                  : alerting()
              }
            >
              Resolve
            </Button>
          </SearchWrapper>
        </Content>
        <MainSection>
          <SubHeadline>Ethereum Address De-anonymization service</SubHeadline>

          <Teaser>
            <TeaserText src="static/images/teaser.svg" />
          </Teaser>
        </MainSection>
      </Container>
    )
  }
}

export default App
