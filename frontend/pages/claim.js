import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import styledNormalize from 'styled-normalize'
import Head from 'next/head'
import MetamaskSigner from '../components/MetamaskSigner'

const Container = styled.div`
  max-width: 100vw;
  display: grid;
  grid-template-columns: (auto-fit, 1fr);
  justify-content: center;
  align-content: center;
  padding: 2rem;
  min-height: 100vh;

  background: linear-gradient(180deg, #6200ee 0%, rgba(98, 0, 238, 0.49) 100%),
    #c4c4c4;

  @media (max-width: 640px) {
    width: 100vw;
  }
`

const Content = styled.nav`
  margin: 0 auto;
  max-width: 920px;
`

export default class Claim extends Component {
  render() {
    return (
      <Container>
        <Content>
          <MetamaskSigner />
        </Content>
      </Container>
    )
  }
}
