import React from 'react'
export default class PageTitle extends React.Component {
  render() {
    return (
      <div className={"page-title " + (this.props.nopadd ? '' : 'padd-bott-30')}>
        <h3 className="no-marg page-title">
          {this.props.title}
        </h3>
        <h6 className="page-desc marg-top-sqm">
          {this.props.subtitle}
        </h6>
      </div>
    );
  }
}
