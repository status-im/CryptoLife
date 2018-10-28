import React, { Component } from 'react';
import Tone from 'tone';
import { newSynFromHash } from '../syn';
import Icon from './Icon';

class Test extends Component {
  constructor() {
    super();
    this.state = {
      hash: '',
    }
  }

  componentDidMount() {
    if (this.state.hash.length > 120) {
      window._song = this.song = newSynFromHash(this.state.hash);
      Tone.Transport.start('+0.1')
    }
    //setInterval(() => this.setState({...this.state, seed: Math.random().toString(36)}), 10000)
  }

  togglePlay = () => {
    if (Tone.Transport.state == "started") {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start('+0.1')
    }
  }

  componentDidUpdate() {
    if (this.song) {
      this.song.dispose();
      this.song = null;
    }
    console.log(this.state.hash)
    console.log(this.state.hash.length)
    if (this.state.hash.length >= 158) {
      window._song = this.song = newSynFromHash(this.state.hash);
    }
  }

  render() {
    return (
      <div className="p-account">
        <h1>Test</h1>
        <button onClick={this.togglePlay}>
          Play/Pause
        </button>
        <input value={this.state.hash} onChange={(evt) => this.setState({...this.state, hash: evt.target.value})} />
        <h3 />
        <Icon hash={this.state.hash} />
      </div>
    )
  }
}

export default Test;
