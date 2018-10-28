import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalDapp from '../modals/ModalDapp';

import './CellActions.scss';

class CellActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isPopup: false, action: null};

    this.togglePopup = this.togglePopup.bind(this);
  }

  togglePopup(action = null) {
    this.setState({isPopup: !this.state.isPopup, action})
  }

  render() {
    const { type, challenges, item, subtype } = this.props;
    const { isPopup, action } = this.state;

    return (<div className="actions">
      {type === 'challenge' && 
        <div className="challenge">
          <div className="border"></div>
          <div className="reject" onClick={this.togglePopup.bind(this, 'challenge')}>
            <FontAwesomeIcon icon="ban"/> Challenge
          </div>
        </div>
      }

      {type === 'commit' && 
        <div className="commit">
          <div className="border"></div>
          <div className="approve" onClick={this.togglePopup.bind(this, 'approve')}>
            <FontAwesomeIcon icon="check"/> Approve
            </div>
          <div className="border"></div>
          <div className="reject" onClick={this.togglePopup.bind(this, 'reject')}>
            <FontAwesomeIcon icon="ban"/> Reject
          </div>
        </div>
      }

      {type == 'reveal' &&
        <div className="reveal">
          <div className="reveal-inner" onClick={this.togglePopup.bind(this, 'reveal')}>
            <FontAwesomeIcon icon={['far', 'eye']}/> Reveal
            &nbsp;<span className="time-left">14:01 left</span>
          </div>
        </div>
      }

      {type === 'get-reward' && 
        <div className="commit">
          <div className="border"></div>
          <div className="approve" onClick={this.togglePopup.bind(this, 'get-reward')}>
            <FontAwesomeIcon icon="coins"/> Get reward
          </div>
        </div>
      }

      {type === 'loose' && 
        <div className="commit">
          <div className="border"></div>
          <div className="loose">You loose :(</div>
          <div className="close">&times; close</div>
        </div>
      }

      {type === 'registry' &&
        <div className="commit">
          <div className="border"></div>
          {(subtype === 'EDIT') &&
            <div className="approve" onClick={this.togglePopup.bind(this, 'update')}>
              <FontAwesomeIcon icon="pen"/> Decline Update
            </div>
          }
          {(subtype === 'APPLICATION') &&
            <div className="reject" onClick={this.togglePopup.bind(this, 'challenge')}>
              <FontAwesomeIcon icon="ban"/> Remove
            </div>
          }
        </div>
      }

      <ModalDapp isOpen={this.state.isPopup} onClose={this.togglePopup} action={action} item={item}/>
    </div>);        
  }
}

export default CellActions;
