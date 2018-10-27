import React, { Component } from "react"
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { getWeb3 } from "./contracts/web3"
import { Layout } from "antd"
const { Header } = Layout

import getBookingsInstance from "./contracts/bookings.js"
import config from "./config.json"

import LoadingView from "./views/loading"
import MessageView from "./views/message"
import HomeView from "./views/home"
import RoomView from "./views/room"
import Container from "./widgets/container"

class App extends Component {
    componentDidMount() {
        this.Bookings = getBookingsInstance()

        this.checkWeb3Status()
        this.statusInterval = setInterval(() => this.checkWeb3Status(), 5000)
    }

    componentWillUnmount() {
        if (this.statusInterval) clearInterval(this.statusInterval)
    }

    checkWeb3Status() {
        let web3 = getWeb3()
        return web3.eth.net.isListening().then(listening => {
            if (!listening) {
                return this.props.dispatch({ type: "SET_DISCONNECTED" })
            }

            return web3.eth.net.getNetworkType().then(id => {
                this.props.dispatch({ type: "SET_NETWORK_ID", networkId: id })

                return web3.eth.getAccounts().then(accounts => {
                    if (accounts.length != this.props.accounts.length || accounts[0] != this.props.accounts[0]) {
                        this.props.dispatch({ type: "SET", accounts })
                    }
                    this.props.dispatch({ type: "SET_CONNECTED" })
                })
            })
        })
    }

    render() {
        if (this.props.status.loading) return <Container><LoadingView /></Container>
        else if (this.props.status.unsupported) return <MessageView message="Your browser does not support Web3" />
        else if (this.props.status.networkId != config.NETWORK_ID) return <MessageView message={`Please, switch to the ${config.NETWORK_ID} network`} />
        else if (!this.props.status.connected) return <MessageView message="Your connection seems to be down" />
        else if (!this.props.accounts || !this.props.accounts.length) return <MessageView message="Please, unlock your wallet or create an account" />

        return <div>
            <Header className="header">
                <h2 className="text-center" style={{color: "white"}}>DHotel</h2>
            </Header>
            <Container>
                <Switch>
                    <Route path="/" exact component={HomeView} />
                    <Route path="/room" exact component={RoomView} />
                    <Redirect to="/" />
                </Switch>
            </Container></div>
    }
}

export default withRouter(connect(({ accounts, status }) => ({ accounts, status }))(App))
