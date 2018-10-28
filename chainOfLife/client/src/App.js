import React, { Component } from 'react';
import './App.css';

import Root from './components/Root';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Root eth={this.props.eth}/>
      </div>
    );
  }
}

export default App;
