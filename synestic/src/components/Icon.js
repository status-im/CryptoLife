import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { renderIcon } from '../syn/icon';
import { propsFromHash } from '../syn';

export default class SynIcon extends React.Component {
  constructor() {
    super()
    this.icon = React.createRef();
  }
  componentDidMount() {
    if (this.props.hash.length >= 158) {
      renderIcon(propsFromHash(this.props.hash), this.icon.current);
    }
  }

  componentDidUpdate() {
    if (this.props.hash.length >= 158) {
      renderIcon(propsFromHash(this.props.hash), this.icon.current);
    }
  }

  render() {
    return (
      <canvas style={{ borderRadius: '50%', background: '#f2f2f2' }} ref={this.icon} width="200" height="200" />
    )
  }
}