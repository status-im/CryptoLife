import React, { Component } from 'react';

import binToHex from '../util/hex';

class Input extends Component {

  constructor(props) {
    super(props);

    let config = new Array(props.size);
    config.fill(false);

    this.state = {
      config: config
    };
  }

  encodeConfig() {
    let bin = this.state.config.reduce((acc, curr) => {
        return acc + (curr ? '1' : '0');
      }, "");
    let hex = this.splitIntoSubArray(bin, 4).map(bin => {
      return binToHex[bin];
    }).reduce((acc, curr) => {
      return acc + curr;
    }, "");
    return '0x' + hex;
  }

  renderButton(alive, i) {
    const onClick = () => {
      const newConfig = this.state.config.slice();
      newConfig[i] = !newConfig[i];
      this.setState({
        config: newConfig
      });
    };
    const style = {
      backgroundColor: alive ? "blue" : "grey",
      height: 20,
      width: 20
    };
    return (
      <button alive={alive ? "alive" : "not"} key={i} style={style} onClick={onClick}/>
    );
  }

  splitIntoSubArray(arr, count) {
    let newArray = [];
    const numIter = Math.floor(arr.length/count);
    let offset = 0;
    for (var i = 0; i < numIter; i++) {
      newArray.push(arr.slice(offset, offset + count));
      offset += count;
    }
    return newArray;
  }

  renderButtonGrid() {

    let buttonArray = this.state.config.map((alive, i) => {
      return this.renderButton(alive, i);
    });

    return this.splitIntoSubArray(buttonArray, 64).map(row => {
      return (
        <div>
         {row}
        </div>
      )
    });
  }

  render() {
    console.log(this.encodeConfig(this.state.config));
    return (
      <div>
        {this.renderButtonGrid()}
      </div>
    );
  }
}

export default Input;