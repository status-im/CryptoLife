import React, { Component } from "react"
import { connect } from "react-redux"
import { Row, Col, Card, Button, Spin, message } from "antd"

import getBookingsInstance from "../contracts/bookings.js"

class RoomView extends Component {
	constructor(props) {
		super(props)
		this.Bookings = getBookingsInstance()
		this.state = {
			canCheckIn: false,
			canCheckOut: false,
			loading: false
		}
	}

	componentDidMount() {
		this.fetchCanCheckIn()
		this.fetchCanCheckOut()
	}

	fetchCanCheckIn() {
		return this.Bookings.methods.canCheckIn().call({ from: this.props.accounts[0] })
			.then(result => this.setState({ canCheckIn: result }))
			.catch(err => {
				this.setState({ canCheckIn: false })
				message.error("Unable to check the status")
			})
	}

	fetchCanCheckOut() {
		return this.Bookings.methods.canCheckOut().call({ from: this.props.accounts[0] })
			.then(result => this.setState({ canCheckOut: result }))
			.catch(err => {
				this.setState({ canCheckOut: false })
				message.error("Unable to check the status")
			})
	}

	onCheckIn() {
		this.setState({ loading: true })

		return this.Bookings.methods.deposit().call().then(value => {
			return this.Bookings.methods.checkIn()
				.send({ from: this.props.accounts[0], value })
		})
			.then(tx => {
				this.setState({ loading: false })

				message.success("Your room is ready! Do you want to get in?")
				this.fetchCanCheckIn()
			}).catch(err => {
				this.setState({ loading: false })
				message.warn("The transaction could not be completed")
				console.error(err)
			})
	}

	onCheckOut() {
		this.setState({ loading: true })

		return this.Bookings.methods.checkOut()
			.send({ from: this.props.accounts[0] })
			.then(tx => {
				this.setState({ loading: false })

				message.success("See you soon!")
				this.props.history.replace("/")
			}).catch(err => {
				this.setState({ loading: false })
				message.warn("The transaction could not be completed")
				console.error(err)
			})
	}

	onOpen() {

	}

	renderCheckIn() {
		return <div>
			<Card>
				You are able to check in
			</Card>
			<Button type="primary" className="width-100 margin-top" onClick={() => this.onCheckIn()}>Check in</Button>
		</div>
	}

	renderAccessCheckout() {
		return <div>
			<Card>
				You currently the guest of the room
			</Card>
			<Button type="primary" className="width-100 margin-top" onClick={() => this.onOpen()}>Unlock the door</Button>
			<Button type="danger" className="width-100 margin-top" onClick={() => this.onCheckOut()}>Check Out</Button>
		</div>
	}

	renderStale() {
		return <div>
			<Button className="width-100" onClick={() => this.props.history.goBack()}>Go back</Button>
		</div>
	}

	renderBody() {
		if (this.state.canCheckIn) return this.renderCheckIn()
		else if (this.state.canCheckOut) return this.renderAccessCheckout()
		return this.renderStale()
	}

	render() {
		return <div id="room">
			<Row>
				<Col>
					<p className="margin-top">Welcome to the check-in desk</p>
				</Col>
			</Row>

			{
				this.renderBody()
			}

			{
				this.state.loading ?
					<p className="margin-top">Please wait... <Spin /></p> : null
			}
		</div>
	}
}

export default connect(({ accounts }) => ({ accounts }))(RoomView)
