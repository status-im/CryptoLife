import React, { Component } from 'react';

import Input from './Input';
import GameList from './GameList';
import Waiting from './Waiting';

import { Switch, Route } from 'react-router-dom';

class Root extends Component {

  constructor(props) {
    super(props);
    this.props.eth.eventEmitter.on('data', event => {
      console.log(event);
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' render={props => {
          return (<GameList eth={this.props.eth}/>);
        }}/>
        <Route path='/create' render={props => {
          return (<Input size={1024} eth={this.props.eth}/>);
        }}/>
        <Route path='/join/:gameId' render={props => {
          return (<Input size={1024} eth={this.props.eth} gameId={props.match.params.gameId}/>);
        }}/>
        <Route path='/waiting/:gameId' render={props => {
          return (<Waiting eth={this.props.eth} gameId={props.match.params.gameId}/>);
        }}/>
      </Switch>
    );
  }
}

export default Root;