import React from 'react'
import {Icon} from 'rmwc/Icon';
import 'material-components-web/dist/material-components-web.min.css';

export default class CardTitle extends React.Component {
  render() {
    return (
      <div className="fl-cont fl-center-vert card-top">
        <div className="fl-col padd-ri-10">
          <div className="card-h-icon">
            <Icon strategy="ligature" className="sm-icon white-text">{this.props.icon}</Icon>
          </div>
        </div>
        <div className="fl-col">
          <h5 className="bold no-marg card-title">{this.props.text}</h5>
        </div>
      </div>
    );
  }
}
