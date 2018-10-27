import React, { Component } from 'react';

class Waiting extends Component {

  render() {
    return (
      <div>
        Waiting for {this.props.gameId}
      </div>
    );
  }
}

export default Waiting;