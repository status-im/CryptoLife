import Tone from "tone";
import React, { Component } from 'react';
import State from '../data/State';
import TokenPreview from './TokenPreview';
import { newSynFromHash } from '../syn';

class Account extends Component {
  constructor() {
    super();
    this.state = {
      selectedForMutation: [],
      playing: false,
      playingToken: null,
      isMutating: false,
      tokens: []
      //  {
      //    hash: "f1a891182fac63b6826fbc166d3dc60570fa86211b0585a27a589b5c2c97cb6fe35122305f58c76d04df782cda7b8c0ae1f50c42360b0b44f4b136b8592f96df8d4488c17d631db4137de0b369ee302b87d43108d82c2d13d2c4dae164be5b7f6a24460beb18eda09bef059b4f71815c3ea18846c161689e9626d70b25f2dbfc",
      //    id: 1
      //  },
      //  {
      //    hash: "9340c2d27e31f8961ae89a0c0241fd3590b67f759cb45101efb32eace0a24242268185a4fc63f12c35d134180483fa6b216cfeeb3968a203df665d59c14484859a061693f18fc4b0d744d060120fe9ac85b3fbace5a2880f7d99756705121214d030b49f8c7e2586ba268300907f4d642d9fdd672d14407beccbab38289090a4",
      //    id: 2
      //  },
      //  {
      //    hash: "95aee6ef31577c86a0c9135c78f08a8556ff7693beb05cb5413169a6be982caf2b5dcdde62aef90d419226b8f1e1150aadfeed277d60b96a8262d34d7d30595fad7737798abbe43506489ae3c784542ab7fbb49df582e5aa098b4d35f4c1657c6bb9bbcc55df21a83244d71e3c22a155bfdda4efac172d504c5a69afa60b2be5",
      //    id: 3
      //  }
      //]
    }
  }
  componentDidMount() {
    State.tokens().then((tokens) => {
      this.setState({
        tokens: JSON.parse(JSON.stringify(tokens)),
      })
    });
  }

  togglePlay(token) {
    if (this.state.playingToken != null) {
      if (this.state.playingToken == token.id) {
        if (Tone.Transport.state == "started") {
          Tone.Transport.stop();
          Tone.Master.volume.value = -100;
          this.setState({...this.state, playing: false})
        } else {
          Tone.Master.volume.value = 0;
          Tone.Transport.start('+0.1')
          this.setState({...this.state, playing: true})
        }
      } else {
        Tone.Transport.stop();
        this.syn.dispose();
        this.syn = newSynFromHash(token.hash);
        Tone.Master.volume.value = 0;
        Tone.Transport.start("+0.1");
        this.setState({...this.state, playingToken: token.id, playing: true})
      }
    } else {
      Tone.Transport.stop();
      this.syn = newSynFromHash(token.hash);
      Tone.Master.volume.value = 0;
      Tone.Transport.start("+0.1");
      this.setState({...this.state, playingToken: token.id, playing: true})
    }
  }

  startMutate(token) {
    this.setState({
      ...this.state,
      selectedForMutation: [ token.id ],
      isMutating: true
    })
  }

  cancelMutate = () => {
    this.setState({
      ...this.state,
      selectedForMutation: [],
      isMutating: false
    })
  }

  finishMutate(token) {
    const selected = [...this.state.selectedForMutation, token.id];
    State.mutate(selected).then(() => window.location.reload());
  }

  mintToken() {
    State.mintToken().then(() => window.location.reload());
  }

  renderTokens() {
    if (this.state && this.state.tokens) {
      return Array.prototype.map.call(this.state.tokens, (token) => {
        return (
          <TokenPreview 
            key={token.id}
            hash={token.hash} 
            tokenId={token.id} 
            isPlaying={(this.state.playingToken == token.id) && this.state.playing}
            isMutating={this.state.isMutating}
            isPicked={this.state.selectedForMutation.indexOf(token.id) != -1}
            togglePlay={this.togglePlay.bind(this, token)}
            startMutate={this.startMutate.bind(this, token)}
            finishMutate={this.finishMutate.bind(this, token)}
            cancelMutate={this.cancelMutate}
          />
        );
      });
    }
  }

  render() {
    return (
      <div className="p-account">
        <ul className="token-list">
          {this.renderTokens()}
          <div className="add-token" onClick={this.mintToken}>
            +
          </div>

        </ul>
      </div>
    )
  }
}

export default Account;
