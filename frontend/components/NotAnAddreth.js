import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 100vw;
`

const Content = styled.nav`
  margin: 0 auto;
  max-width: 920px;
  display: grid;
  grid-template-columns: (auto-fill, 1fr);
  grid-gap: 1rem;
  justify-content: center;
`

const ErrorImage = styled.img`
  width: 320px;
  justify-self: center;
`

const Headline = styled.h1`
  text-align: center;
  color: #ff9a62;
  font-weight: 100;
  line-height: 1rem;
`

const ContentText = styled.p`
  text-align: center;
`

export default class NotAnAddreth extends PureComponent {
  render() {
    return (
      <Container>
        <Content>
          <ErrorImage src="../static/images/living-ghost.svg" />
          <Headline>Wait a sec...</Headline>
          <ContentText>
            This doesn't smell like an Ethereum address nor a registered ENS domain!
          </ContentText>
        </Content>
      </Container>
    )
  }
}
