import React from 'react'
const Identicon = require('identicon.js');

export default class BrandieIdenticon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hash: props.hash ? props.hash : '0',
      size: props.size ? props.size : 35
    };

  }

  componentDidMount() {
    this.initIdenticon();
  }

  componentWillReceiveProps() {
    this.initIdenticon(this.props.hash);
  }

  initIdenticon(hash, size) {
    this.setState({
      avatarData: new Identicon((hash ? hash : this.state.hash), {
        margin: 0.22,
        size: (size ? size : this.state.size),
        background: [216, 216, 216, 255],
        brightness: 0.4,
        saturation: 1
      }).toString()
    })
  }

  render() {
    return (
      <div>
        {this.state.hash ? <img width={this.state.size} height={this.state.size} style={{borderRadius: "10px"}}
                                      src={"data:image/png;base64," + this.state.avatarData}/> : null}
      </div>
    );
  }
}
