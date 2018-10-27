import React, { Component } from 'react';
import './App.css';

import Input from './components/Input';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Input size={1024}/>
      </div>
    );
  }
}

export default App;
