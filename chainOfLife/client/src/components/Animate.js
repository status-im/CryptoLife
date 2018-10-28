import React, { Component } from 'react';

class Animate extends Component {

  constructor(props){
    super(props);
    console.log(this.props);
  }

  initCanvas() {
    
  }

  render() {
    return (
      <div>
        Animate
        <canvas id="canvas">
        </canvas>
      </div>
    );
  }
}

export default Animate;