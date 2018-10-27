import React, { Component } from 'react';

import { splitIntoSubArray, getConfigHash }  from '../util/hex';

class Input extends Component {

  constructor(props) {
    super(props);

    this.registerGame = this.registerGame.bind(this);

    let config = (new Array(props.size)).fill(false);
    this.state = {
      config: config
    };
  }

  renderButton(alive, i) {
    const onClick = () => {
      const newConfig = this.state.config.slice();
      newConfig[i] = !newConfig[i];
      this.setState({
        config: newConfig
      });
    };
    const style = {
      backgroundColor: alive ? "blue" : "grey",
      height: 20,
      width: 20
    };
    return (
      <button alive={alive ? "alive" : "not"} key={i} style={style} onClick={onClick}/>
    );
  }

  renderButtonGrid() {
    let buttonArray = this.state.config.map((alive, i) => {
      return this.renderButton(alive, i);
    });
    return splitIntoSubArray(buttonArray, 64).map(row => {
      return (
        <div>
         {row}
        </div>
      )
    });
  }

  async registerGame() {
    const boolConfig = this.state.config;
    const account = (await this.props.eth.web3.eth.getAccounts())[0];
    await this.props.eth.contract.methods.register(getConfigHash(boolConfig)).send({
      from: account
    });
  }

  async joinGame() {
    
  }

  render() {
    console.log(this.props.gameId);
    return (
      <div>
        {this.renderButtonGrid()}
        <button onClick={this.registerGame}>Host</button>
      </div>
    );
  }
}

export default Input;