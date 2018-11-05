import React from 'react';

import './CellDappName.scss';

class CellDappName extends React.Component {
  render() {
    const { icon, name, desc } = this.props;

    return (<div className="dapp-name">
      <div className="icon"><img src={icon} alt={`${name} icon`}/></div>
      <div>
        <div className="name">{name}</div>
        <div className="desc-short">{desc}</div>
      </div>
    </div>);        
  }
}

export default CellDappName;
