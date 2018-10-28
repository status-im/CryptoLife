import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Spinner.scss';

class Spinner extends React.Component {
  render() {
    return (
      <div className="spinner"><FontAwesomeIcon icon="spinner"/></div>
    );
  }
}

export default Spinner;
