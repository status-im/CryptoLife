import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import './CellDappStatus.scss';

import { Contract, afterInit } from '../../helpers/eth';

function Stage(props) {
  const { type, status, subtype } = props;

  return (<div className={`stage ${status}`}>
    {type === 'submitted' && <><FontAwesomeIcon icon="plus-square"/> New submitted</>}
    {type === 'updated' && <><FontAwesomeIcon icon="pen"/> Updated</>}
    {type === 'in-registry' && <>In registry</>}
    {type === 'challenged' &&
      <><FontAwesomeIcon icon="gavel"/> {subtype.charAt(0).toUpperCase() + subtype.slice(1)}. Commit</>}
    {type === 'reveal' && <>Reveal</>}
    {type === 'rejected' && <>Rejected</>}
    {type === 'challenged-update' && <><FontAwesomeIcon icon="pen"/> &nbsp; Update submitted</>}
    {type === 'challenged-remove' && <><FontAwesomeIcon icon="gavel"/> &nbsp; Challenged</>}
  </div>);
}

function ProgressBar(props) {
  const { passedPercent } = props;

  return (<div className="progress-bar">
    {passedPercent > 0 &&
      <div className="filled" style={{flexGrow: passedPercent}}></div>
    }
    {passedPercent < 100 &&
      <div className="empty" style={{flexGrow: 100 - passedPercent}}></div>
    }
  </div>);
}

function ProgressBarFork(props) {
  const { status } = props;

  return (<div className="progress-bar-fork">
    <div className={classNames('top', {filled: status === 'in-registry'})}></div>
    <div className={classNames('middle', {filled: status !== 'future'})}></div>
    <div className={classNames('bottom', {filled: status === 'rejected'})}></div>
  </div>);
}

class CellDappStatus extends React.Component {

  updateStatus() {
    let contract = Contract('Registry');

    contract.send('update_status', [this.props.item.id])
      .then(console.log());
  }

  render() {
    const { type, stage, passedPercent, challenges, item } = this.props;

    let paylo = null;

    if (type === 'submitted' || type === 'updated') {
      paylo = (<div className="dapp-status">
        <Stage type={type} status="active"/>
        <ProgressBar passedPercent={passedPercent}/>
        <Stage type="in-registry" status="future"/>
      </div>);
    }

    else if (type === 'challenged') {
      let [challengedStatus, passed1, revealStatus, passed2, finishStatus] = new Array(5);

      let challengeStatus = item.challengeStatus;

      let subtype = item.state;

      let stage = challengeStatus.phase;
      challengedStatus = stage === 'commit' ? 'active' : 'passed';
      passed1 = stage === 'commit' ? (challengeStatus.commitEndDate - new Date().getTime()/1000) / 60 : 100;

      if (stage === 'commit') {
        revealStatus = 'future';
        passed2 = 0;
      } else {
        revealStatus = stage === 'reveal' ? 'active' : 'passed';
        passed2 = stage === 'reveal' ? (challengeStatus.revealEndDate - new Date().getTime()/1000) / 60 : 100;
      }

      if (stage === 'commit' || stage === 'reveal') {
        finishStatus = 'future';
      } else {
        finishStatus = stage;
      }

      paylo = (<div className="dapp-status">
        <Stage type="challenged" status={challengedStatus} subtype={subtype} />
        <ProgressBar passedPercent={passed1}/>
        <Stage type="reveal" status={revealStatus}/>
        <ProgressBar passedPercent={passed2}/>
        <ProgressBarFork status={finishStatus}/>
        <div className="finish">
          <Stage type="in-registry" status={stage === 'in-registry' ? 'active' : 'future'}/>
          <Stage type="rejected" status={stage === 'rejected' ? 'active' : 'future'}/>
        </div>
      </div>);
    }

    else if (type === 'registry') {
      paylo = (<div className="dapp-status registry">
        {(Array.isArray(challenges) && challenges.indexOf('update') !== -1) &&
          <Stage type="challenged-update" status="active "/>
        }
        {(Array.isArray(challenges) && challenges.indexOf('remove') !== -1) &&
          <Stage type="challenged-remove" status="active"/>
        }
      </div>);
    }

    return (<>
      {paylo}
      <div className="update" onClick={() => this.updateStatus()}>
        <FontAwesomeIcon icon="ban"/> Update Status
      </div>
    </>)
  }
}

export default CellDappStatus;
