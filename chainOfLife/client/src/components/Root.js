import React, { Component } from 'react';

import Input from './Input';
import GameList from './GameList';
import Waiting from './Waiting';
import Animate from './Animate';

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
          return (<Input size={512} eth={this.props.eth}/>);
        }}/>
        <Route path='/join/:gameId' render={props => {
          return (<Input size={512} eth={this.props.eth} gameId={props.match.params.gameId}/>);
        }}/>
        <Route path='/waiting/:gameId' render={props => {
          return (<Waiting eth={this.props.eth} gameId={props.match.params.gameId}/>);
        }}/>
        <Route path='/animate/:gameId' render={props => {
          console.log(props);
          return (<Animate 
            eth={this.props.eth} 
            gameId={props.match.params.gameId}
            me={props.location.state ? props.location.state.me : null}
            him={props.location.state ? props.location.state.him : null}
          />);
        }}/>
      </Switch>
    );
  }
}

export default Root;