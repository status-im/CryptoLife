import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import styledNormalize from 'styled-normalize'
import Head from 'next/head'

import SearchBar from '../components/SearchBar/SearchBar'

injectGlobal`
  ${styledNormalize}
  body {
    line-height: 1.5;
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
  background-size: 100%;
  height: 2000px;
`

const Content = styled.nav`
  margin: 0 auto;
  max-width: 48em;
`

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  height: 4rem;
`

const NavLink = styled.a`
  text-transform: uppercase;
  font-size: 22px;
  font-weight: 600;
  opacity: 0.7;
  padding: 2rem;
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
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 7rem;
`

class App extends Component {
  render() {
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
            <SearchBar />
          </SearchWrapper>
        </Content>
      </Container>
    )
  }
}

export default App
