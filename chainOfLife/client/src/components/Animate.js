import React, { Component } from 'react';

import P2life from '../lib/p2life-lib/p2life';

class Animate extends Component {

  constructor(props){
    super(props);
    this.game = new P2life(this.props.me, this.props.him);

    this.displayCurrentGameState = this.displayCurrentGameState.bind(this);
    this.play = this.play.bind(this);
  }

  componentDidMount() {
    this.initCanvas(20, this.game.dish[0].length, this.game.dish.length);
    this.play(100, 0);
  }

  async computeAndSubmitWinner(game, numIter) {
    for (let i = 0; i < numIter; i++) {
      game.step();
    }
    
  }

  initCanvas(ratio, w, h) {
    let can = document.getElementById('canvas');
    can.width = w;
    can.height = h;
    can.style.width = (ratio*w) + 'px';
    can.style.height = (ratio*h) + 'px';
  }

  play(numIter, currentIter) {
    if(currentIter == numIter) {
      return;
    }
    this.displayCurrentGameState();
    this.game.step();
    setTimeout(() => this.play(numIter, currentIter+1), 1000);
  }

  displayCurrentGameState() {
    let can = document.getElementById('canvas');
    let ctx = can.getContext('2d');
    
    const colors = {
      0: 'grey',
      1: 'blue',
      2: 'yellow'
    }
    const rowLength = 32;

    for (let i = 0; i < this.game.dish.length; i++) {
      let row = this.game.dish[i];
      for (let j = 0; j < rowLength; j++) {
        ctx.beginPath();
        let element = row[j];
        ctx.rect(j, i, 1, 1);
        ctx.fillStyle=colors[element];
        ctx.fill();
      }
    }
  }

  render() {
    return (
      <div>
        <div> 
          Animate
        </div>
        <div>
          <canvas id="canvas">
          </canvas>
        </div>
      </div>
    );
  }
}

export default Animate;