import React from 'react';
import Transition from 'react-transition-group/Transition';

import Modal from './Modal';

export default class ModalContainer extends React.PureComponent {
  render() {
    const { isOpen, animationWindow = { duration: 0 } } = this.props;

    return (
      <Transition
        in={isOpen}
        timeout={{
          enter: 0,
          exit: animationWindow.duration,
        }}
        unmountOnExit={true}
      >
        {(state) => <Modal state={state} {...this.props} />}
      </Transition>
    );
  }
}
