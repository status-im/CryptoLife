import React from 'react';
import classNames from 'classnames';

import './TableRow.scss';

class TableRow extends React.Component {
  render() {
    const { children, type } = this.props;

    return (<div className={classNames('table-row', {'table-row-header': type === 'header'})}>
      {children}
    </div>);
  }
}

export default TableRow;
