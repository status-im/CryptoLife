import React, { Component } from 'react';

import { splitIntoSubArray, getConfigHash, encodeConfigBytes32Array }  from '../util/hex';

import { Redirect } from 'react-router';

class Input extends Component {

  constructor(props) {
    super(props);

    this.registerGame = this.registerGame.bind(this);
    this.joinGame = this.joinGame.bind(this);

    let config = (new Array(props.size)).fill(false);
    this.state = {
      config: config,
      gameId: '0x00',
      mined: false
    };
  }

  renderButton(alive, i) {
    const onClick = () => {
      const newConfig = this.state.config.slice();
      newConfig[i] = !newConfig[i];
      this.setState({
        ...this.state,
        config: newConfig
      });
    };
    const color = this.props.gameId ? "yellow" : "blue";
    const style = {
      backgroundColor: alive ? color : "grey",
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
    const gameId = getConfigHash(boolConfig);
    await this.props.eth.contract.methods.register(gameId).send({
      from: account
    });
    this.props.eth.eventEmitter.on('data', event => {
      if(event.event === "StartGame" && event.returnValues.gameId === gameId) {
        this.setState({
          ...this.state,
          mined: true
        });
      }
    });
    this.setState({
      ...this.state,
      gameId: gameId
    });
  }

  async joinGame() {
    const boolConfig = this.state.config;
    const account = (await this.props.eth.web3.eth.getAccounts())[0];
    console.log(encodeConfigBytes32Array(boolConfig));
    await this.props.eth.contract.methods.join(this.props.gameId, encodeConfigBytes32Array(boolConfig)).send({
      from: account
    });
  }

  render() {
    if (this.state.mined) {
      return <Redirect to={"/waiting/" + this.state.gameId} />;
    }
    return (
      <div>
        {this.renderButtonGrid()}
        {this.props.gameId ? 
          <button onClick={this.joinGame}>Join</button> :
          <button onClick={this.registerGame}>Host</button>}
      </div>
    );
  }
}

export default Input;