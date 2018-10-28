import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'

import Web3Connector from './components/containers/web3Connector';
import Header from "./components/shared_components/Header";
import Sidebar from './components/shared_components/Sidebar';
import Web3Connection from './components/shared_components/Web3Connection';

import Tokens from './components/pages/Tokens';
import Brands from './components/pages/Brands';
import AddBrand from './components/pages/AddBrand';
import IssueToken from './components/pages/IssueToken';

import 'material-components-web/dist/material-components-web.min.css';
import TokenInfo from "./components/pages/TokenInfo";

const ROUTES = {
    '/': {title: 'Tokens'},
    '/tokens': {title: 'Tokens'},
};


export default class App extends Component {

    constructor(props) {
        super(props);

        this.prevLocation = window.location.pathname;
        this.state = {
            web3Connector: {},
            pageTitle: this.getPageTitle()
        };

        this.updateWeb3Connector = this.updateWeb3Connector.bind(this);
    }

    updateWeb3Connector(web3Connector) {
        this.setState({web3Connector: web3Connector});

        if (web3Connector) {
            if (!this.state.libInit) {
                // todo: connect to web3
                this.setState({libInit: true});
            }
            if (this.state.libInit) {
                // todo: init data
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (window.location.pathname !== this.prevLocation) {
            this.prevLocation = window.location.pathname;
            this.setState({pageTitle: this.getPageTitle()})
        }
    }

    getPageTitle() {
        return ROUTES[this.prevLocation] ? ROUTES[this.prevLocation].title : 'Page not found';
    }

    changeTitle(title) {
        this.setState({pageTitle: title})
    }

    toggleSidebar() {
        this.persistentOpen = this.persistentOpen === undefined ? false : !this.persistentOpen;
    }

    render() {
        let web3Connector = this.state.web3Connector;
        let content;
        if (!web3Connector.provider) {
            content = <Web3Connection/>;
        }
        else {
            content = (
                <div>
                    <Header avatarData={this.state.avatarData}/>
                    <div className="fl-cont b-content">
                        <div className="fl-wrap" style={{minWidth: "200px"}}>
                            <Sidebar persistentOpen={this.persistentOpen}/>
                        </div>
                        <div className="fl-wrap fl-grow main-content">
                            <div className="brandie-page-content">
                                <Switch>
                                    <Route exact path='/' render={() => <Brands web3Connector={web3Connector}/>}/>
                                    <Route exact path='/tokens'
                                           render={() => <Tokens web3Connector={web3Connector}/>}/>
                                    <Route exact path='/brands'
                                           render={() => <Brands web3Connector={web3Connector}/>}/>
                                     <Route exact path='/add-brand'
                                           render={() => <AddBrand web3Connector={web3Connector}/>}/>
                                     <Route exact path='/issue-token'
                                           render={() => <IssueToken web3Connector={web3Connector}/>}/>
                                      <Route path='/token-info/:address'
                                           render={() => <TokenInfo web3Connector={web3Connector}/>}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }

        return (
            <div className="App">
                <Web3Connector updateWeb3Connector={this.updateWeb3Connector}/>
                {content}
            </div>
        );
    }
}



