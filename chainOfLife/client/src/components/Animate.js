import React, { Component } from 'react';

import P2life from '../lib/p2life-lib/p2life';

const test1 = ["0x1110000000000000000000000000000000000000000000000000000000000000", "0x1111000000000000000000200000000000000140000000000000028000000000", "0x0000000000000000000000400000000000000200000000000000000000000000", "0x0000010000000000000000000000000000000000000000000000000000000000"];
const test2 = ["0x0000000000000000000000000000000000000000000000000000000000000000", "0x0000000000000000000000200000000000000140000000000000028000000000", "0x0000000000000000000000400000000000000200000000000000000000000000", "0x0000010000000000000000000000000000000000000000000000000000000000"];

class Animate extends Component {

  constructor(props){
    super(props);
    console.log(this.props);
    this.game = new P2life(test1, test2);
    this.displayCurrentGameState = this.displayCurrentGameState.bind(this);
    this.play = this.play.bind(this);

    console.log(this.game);
  }

  componentDidMount() {
    this.play(100, 0);
  }

  play(numIter, currentIter) {
    if(currentIter == numIter) {
      return;
    }
    console.log(this.game.dish);
    this.displayCurrentGameState(this.game.dish[0].length, this.game.dish.length);
    this.game.step();
    setTimeout(() => this.play(numIter, currentIter+1), 1000);
  }

  displayCurrentGameState(w, h) {
    let can = document.getElementById('canvas');
    can.width = w;
    can.height = h;
    can.style.width = (5*w) + 'px';
    can.style.height = (5*h) + 'px';
    let ctx = can.getContext('2d');
    

    const colors = {
      0: 'grey',
      1: 'blue',
      2: 'yellow'
    }
    const rowLength = 256;

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
        <canvas id="canvas">
        </canvas>
      </div>
    );
  }
}

export default Animate;