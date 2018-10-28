import React, { Component } from 'react';

import { Redirect } from 'react-router';

class Waiting extends Component {

  constructor(props) {
    super(props);

    const myConfig = JSON.parse(window.localStorage.getItem(this.props.gameId));

    this.state = {
      joined: false,
      playerTwoField: null,
      myField: myConfig
    }

    this.props.eth.eventEmitter.on('data', event => {
      if(event.event === "JoinGame" && event.returnValues.gameId === this.props.gameId) {
        this.setState({
          ...this.state,
          joined: true,
          playerTwoField: event.returnValues.PlayerTwoField
        });
      }
    });
  }

  render() {
    if (this.state.joined) {
      const location = '/animate/' + this.props.gameId;
      const state = {
        me: this.state.myField,
        him: this.state.playerTwoField
      }
      return <Redirect to={{
        pathname: location,
        state: state
      }} />;
    }
    return (
      <div>
        Waiting for {this.props.gameId}
      </div>
    );
  }
}

export default Waiting;