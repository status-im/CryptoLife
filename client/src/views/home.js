import React, { Component } from "react"
import { connect } from "react-redux"
import { Row, Col, Card, DatePicker, Button, Spin, message, notification } from "antd"
import { getInjectedWeb3 } from "../contracts/web3"

import getBookingsInstance from "../contracts/bookings.js"

class HomeView extends Component {
	constructor(props) {
		super(props)
		this.Bookings = getBookingsInstance()
		this.state = {
			selectedDate: null,
			currentBooking: null,
			bookingLoading: false
		}
	}

	componentDidMount() {
		this.fetchGuestBooking()
	}

	fetchGuestBooking() {
		this.Bookings.methods.getBooking().call({from: this.props.accounts[0]})
			.then(result => {
				if (result[0] != "0" && result[1] != "0" && result[2] != "0") {
					this.setState({
						currentBooking: {
							year: result[0],
							month: result[1],
							day: result[2]
						}
					})
				}
				else {
					this.setState({ currentBooking: null })
				}
			})
			.catch(err => {
				this.setState({ currentBooking: null })
				message.warn("The availability status could not be checked")
				this.setState({ selectedDate: null })
			})
	}

	datePicked(date) {
		if (!date) return
		date = date.toDate()
		const today = new Date()
		today.setHours(0)
		today.setMinutes(0)
		today.setSeconds(0)
		today.setMilliseconds(0)

		if (date < today) return message.error("The date must be in the future")
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()

		this.Bookings.methods.isAvailable(year, month, day).call()
			.then(result => {
				if (result) {
					message.info("The room is available")
					this.setState({ selectedDate: date })
				}
				else {
					message.warn("The room is already booked on that date")
					this.setState({ selectedDate: null })
				}
			})
			.catch(err => {
				message.warn("The availability status could not be checked")
				this.setState({ selectedDate: null })
			})
	}

	onBookRoom() {
		if (!this.state.selectedDate) return
		const year = this.state.selectedDate.getFullYear()
		const month = this.state.selectedDate.getMonth() + 1
		const day = this.state.selectedDate.getDate()

		this.setState({ bookingLoading: true })

		return this.Bookings.methods.price().call().then(value => {
			return this.Bookings.methods.bookRoom(year, month, day)
				.send({ from: this.props.accounts[0], value })
		})
			.then(tx => {
				this.setState({ bookingLoading: false })

				message.success("Your reservation has been registered!")
				this.fetchGuestBooking()
			}).catch(err => {
				this.setState({ bookingLoading: false })
				message.warn("The transaction could not be completed")
				console.error(err)
			})
	}

	renderCurrentReservation() {
		return <div>
			<Card className="margin-bottom">
				<p>You currently have a reservation</p>
				<p>Arrival on {this.state.currentBooking.day}/{this.state.currentBooking.month}/{this.state.currentBooking.year}</p>
			</Card>
			<Button type="danger" className="width-100" onClick={() => this.onBookRoom()}>Cancel booking</Button>
		</div>
	}

	renderBookForm() {
		return <div>
			<Card className="margin-bottom">
				<p>Choose the date you'd like to book</p>
				<DatePicker className="width-100" onChange={value => this.datePicked(value)} />
			</Card>

			{
				this.state.selectedDate && (!this.state.bookingLoading) ?
					<Button type="primary" className="width-100" onClick={() => this.onBookRoom()}>Book now</Button> : null
			}

			{
				this.state.bookingLoading ?
					<p>Please wait... <Spin /></p> : null
			}
		</div>
	}

	render() {
		return <div id="home">
			<Row>
				<Col>
					<p id="headline">Welcome to the first distributed hotel</p>
				</Col>
			</Row>

			{this.state.currentBooking ? this.renderCurrentReservation() : this.renderBookForm()}
		</div>
	}
}

export default connect(({ accounts }) => ({ accounts }))(HomeView)
