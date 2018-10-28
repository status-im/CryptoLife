import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';

import BlockTabs from './tabs/BlockTabs';
import ItemForm from './forms/ItemForm';
import ButtonAddDapp from './common/ButtonAddDapp';
{/*
  import BlockSubmitted from './blocks/BlockSubmitted';
  import BlockChallengedRemove from './blocks/BlockChallengedRemove';
  import BlockChallengedUpdate from './blocks/BlockChallengedUpdate';
  import BlockRegistry from './blocks/BlockRegistry';
*/}

import './Dapp.scss';
import logo from '../assets/logo-horisontal.svg';
import {afterInit, Contract} from "../helpers/eth";
import axios from 'axios';
import { log } from 'util';
//
// function Main ({location}) {
//
//   if (/form=1/.test(location.search)) {
//     return (<ItemForm/>);
//
//   } else {
//     return (<div className="dapp-container">
//       <div className="top-line">
//         <div className="logo">
//           <img src={logo}/>
//           <div>Token curated DApp registry</div>
//         </div>
//         <div className="add-buttin"><ButtonAddDapp/></div>
//       </div>
//
//       <BlockTabs/>
//       {/*
//         <BlockSubmitted/>
//         <BlockChallengedUpdate/>
//         <BlockChallengedRemove/>
//         <BlockRegistry/>
//       */}
//     </div>);
//   }
// }

const browserHistory = createBrowserHistory();

class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.interval = null;
  }

  componentWillMount() {
    this.fetch_data();

    this.interval = setInterval(() => {
      this.fetch_data();
    }, 60 * 1000);
  }

  // componentWillUnmount() {
  //   if (this.interval) {
  //     clearInterval(this.interval);
  //     this.interval = null;
  //   }
  // }

  fetch_challenge_statuses() {
    let contract = Contract('Registry');

    let list = this.state.list;

    Promise.all(this.state.list.map(item => {
      if (item.isChallenged)
        return contract.call('challenge_status', [item.id]);
      else
        return null;
    })).then(res => {
      res.forEach((status, idx) => {
        if (status !== null) {
          list[idx].challengeStatus = {
            phase: status[1] === 0 ? 'commit' : 'reveal',
            challengeId: status[0],
            votesFor: status[3],
            votesAgainst: status[4],
            commitEndDate: status[5],
            revealEndDate: status[6]
          }
        }
        else {
          list[idx].challengeStatus = null;
        }
      });

      this.setState({list: list});
    });
  }

  fetch_data() {
    afterInit.then(() => {
      let contract = Contract('Registry');

      let list = null;
      let listIds = null;

      contract.call('list')
        .then(ids => {
          listIds = ids;
          return Promise.all(ids.map(id => {
            return contract.call('get_info', [id])
          }))
        })
        .then(res => {
          list = res;
          return Promise.all(list.map(item => {
            return axios.get('https://ipfs.io' + '/ipfs/' + Buffer.from(item[3].substr(2), 'hex').toString())
          }))
        })
        .then(res => {
          res.forEach((data, idx) => {
            list[idx].ipfs_data = data;
          });

          const newList = list.map((l, i) => {
            const res = {};
            res.id = listIds[i];
            res.state = ['NOT_EXISTS', 'APPLICATION', 'EXISTS', 'EDIT', 'DELETING'][+l[0].toString()];
            res.isChallenged = l[1];
            res.canBeUpdated = l[2];
            res.ipfsHash = l[3];
            res.proposedIpfsHash = l[4];
            res.ipfsData = l.ipfs_data.data;
            return res;
          });

          this.state.list = newList;
          //this.setState({list: newList});
          this.fetch_challenge_statuses()
        });
    });
  }

  render() {
    return (<Router history={browserHistory}>
      <Switch>
        <Route path="/" render={(props) => (
          <div className="dapp-container">
            <div className="top-line">
              <div className="logo">
                <img src={logo}/>
                <div>Token curated DApp registry</div>
              </div>
              <div className="add-buttin"><ButtonAddDapp/></div>
            </div>

            <BlockTabs data={this.state.list}/>
          </div>)}/>
      </Switch>
    </Router>);
  }
}

export default Dapp;
