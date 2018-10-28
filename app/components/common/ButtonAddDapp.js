import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalDapp from '../modals/ModalDapp';

import './ButtonAddDapp.scss';

class ButtonAddDapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })
  }

  render() {
    return (<>
      <button className="add-dapp" onClick={this.toggleModal.bind(this)}>
        <FontAwesomeIcon icon="plus-square"/> Submit a Dapp
      </button>

      <ModalDapp isOpen={this.state.isModalOpen} onClose={this.toggleModal}/>
    </>);
  }
}

export default ButtonAddDapp;
