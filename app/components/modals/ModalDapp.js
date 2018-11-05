import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalContainer from './ModalContainer';
import ItemForm from '../forms/ItemForm';
import FormChallenge from '../forms/FormChallenge';

import './ModalDapp.scss';

class ModalDapp extends React.Component {
  render() {
    const {isOpen, onClose, action, item} = this.props;
    return (
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <div className="modal-dapp">
          {!action && <>
            <div className="modal-h"><FontAwesomeIcon icon="plus-square"/> Submit a Dapp</div>
            <ItemForm/>
          </>}

          {action === 'challenge' && <>
            <div className="modal-h challenge"><FontAwesomeIcon icon="ban"/> Challenge a Dapp</div>
            <FormChallenge buttonText="Start challenge" item={item}/>
          </>}

          {action === 'approve' && <>
            <div className="modal-h approve"><FontAwesomeIcon icon="check"/> Vote for approve</div>
            <FormChallenge buttonText="Vote"/>
          </>}

          {action === 'reject' && <>
            <div className="modal-h reject"><FontAwesomeIcon icon="ban"/> Vote for reject</div>
            <FormChallenge buttonText="Vote"/>
          </>}

          {action === 'reveal' && <>
            <div className="modal-h reveal"><FontAwesomeIcon icon="eye"/> Reveal your vote</div>
            <FormChallenge buttonText="Reveal vote"/>
          </>}

          {action === 'get-reward' && <>
            <div className="modal-h get-reward"><FontAwesomeIcon icon="coins"/> Get reward</div>
            <FormChallenge buttonText="Get reward"/>
          </>}

          {action === 'update' && <>
            <div className="modal-h update"><FontAwesomeIcon icon="pen"/> Submit an update</div>
            <ItemForm/>
          </>}
        </div>
      </ModalContainer>
    );
  }
}

export default ModalDapp;
