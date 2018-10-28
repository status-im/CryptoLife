import React, { Component } from 'react';
import { Link } from "react-router-dom";
import State from '../data/State';

class Token extends Component {
  componentDidMount() {
    this.loadToken()
  }

  componentWillReceiveProps() {
    this.loadToken()
  }

  loadToken() {
    this.tokenId = this.props.match.params.tokenId;
    this.setState({token: []});

    State.token(this.tokenId).then((token) => {
      this.setState(token);
    }).catch(() => {
      console.error("JDJJJD", arguments);
    });
  }

  renderToken() {
    if (this.state && this.state.token && this.state.token.parentA) {
      const tok = this.state.token;
      console.log("XXXX", tok);
      return (
        <div>
          <div>
            <i>Parent A</i> <Link to={`/token/${tok.parentA}`}>{tok.parentA}</Link>
          </div>
          <div>
            <i>Parent B</i> <Link to={`/token/${tok.parentB}`}>{tok.parentB}</Link>
          </div>
          <div>
            <i>Content</i>
            <div style={{wordWrap: "break-word"}}>{tok.value}</div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="p-token">
        <h1>Token <i>{this.tokenId}</i></h1>
        {this.renderToken()}
      </div>
    )
  }
}

export default Token;

