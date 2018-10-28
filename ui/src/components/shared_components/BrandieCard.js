import React from 'react'
export default class BrandieCard extends React.Component {
  render() {
    return (
      <div className={`brandie-card padd-30 marg-bott-30 ${this.props.className}`}>
        {this.props.children}
      </div>
    );
  }
}
