import React from 'react'
import {Link} from 'react-router-dom'

import {Button} from 'rmwc/Button';
import classes from './BrandieButton.scss';

const sizes = ['sm', 'md', 'lg'];

export default class BrandieButton extends React.Component {
  render() {
    if (!sizes.includes(this.props.size)){
      // todo: raise an error
    }
    return (
      <Button raised {...this.props} className={`brandie-btn brandie-btn-${this.props.size} brandie-btn-${this.props.color}`}>{this.props.children}</Button>
    )
  }
}

BrandieButton.defaultProps = {
  size: 'md',
  color: 'accent'
};