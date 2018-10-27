import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import styledNormalize from 'styled-normalize'
import Head from 'next/head'
import MetamaskSigner from '../../components/MetamaskSigner'

export default class Claim extends Component {
  render() {
    return (
      <div>
        <MetamaskSigner />
      </div>
    )
  }
}
