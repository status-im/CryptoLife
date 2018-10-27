import React, { PureComponent } from 'react'

export default class NotAnAddress extends PureComponent {
  render() {
    return (
      <div>Wait a sec... This doesn't smell like an Ethereum address nor ENS domain!</div>
    )
  }
}
