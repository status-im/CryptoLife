const Bookings = artifacts.require("./Bookings.sol")
var bookingsInstance
const price = web3.toWei(0.3, "ether")
const deposit = web3.toWei(0.3, "ether")
const testingGasPrice = 100000000000

function makeDateObject(date = new Date()) {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate()
	}
}

contract('Bookings', function (accounts) {
	const guestAccount = accounts[1]
	const hotelAccount = accounts[2]

	it("should be properly deployed", async function () {
		bookingsInstance = await Bookings.deployed()
	})

	it("should show as available when there are no reservations yet", async function () {
		const date = makeDateObject()
		let available = await bookingsInstance.isAvailable.call(date.year, date.month, date.day)
		assert.isOk(available)
	})

	it("should show as not checked in when empty", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
	})

	it("should reject a booking if the value is invalid", async function () {
		try {
			const date = makeDateObject()
			await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: 0, from: guestAccount })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
	})

	it("should accept a valid booking", async function () {
		let date = makeDateObject()
		await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: price, from: guestAccount })

		date = makeDateObject(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2))
		await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: price, from: guestAccount })

		date = makeDateObject(new Date(Date.now() + 1000 * 60 * 60 * 24 * 5))
		await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: price, from: guestAccount })
	})

	it("should show as unavailable when there are reservations", async function () {
		let date = makeDateObject()
		let available = await bookingsInstance.isAvailable.call(date.year, date.month, date.day)
		assert.isOk(!available)
		
		date = makeDateObject(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2))
		available = await bookingsInstance.isAvailable.call(date.year, date.month, date.day)
		assert.isOk(!available)
		
		date = makeDateObject(new Date(Date.now() + 1000 * 60 * 60 * 24 * 5))
		available = await bookingsInstance.isAvailable.call(date.year, date.month, date.day)
		assert.isOk(!available)
	})

	it("should still show as not checked in", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
	})

	it("should reject a booking when already reserved", async function () {
		try {
			const date = makeDateObject()
			await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: price, from: guestAccount })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
	})

	it("should again show as not checked in", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
	})

	it("should allow to cancel", async function () {
		const date = makeDateObject()
		await bookingsInstance.cancelBooking(date.year, date.month, date.day, { from: guestAccount })
	})

	it("should reject canceling when there is no reservation", async function () {
		try {
			const date = makeDateObject()
			await bookingsInstance.cancelBooking(date.year, date.month, date.day, { from: guestAccount })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
	})

	it("should allow to book again", async function () {
		const date = makeDateObject()
		await bookingsInstance.bookRoom(date.year, date.month, date.day, { value: price, from: guestAccount })
	})

	it("should reject a check-in if the deposit is invalid", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
		try {
			await bookingsInstance.checkIn({ value: 0, from: guestAccount })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
		occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
	})

	it("should reject a check-in from someone other than the guest", async function () {
		try {
			await bookingsInstance.checkIn({ value: deposit, from: accounts[4] })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
	})

	it("should reject a check-out if no one is checked in", async function () {
		try {
			await bookingsInstance.checkOut({ from: guestAccount })
			assert.fail("The transaction should have thrown an error")
		}
		catch (err) {
			assert.include(err.message, "revert", "The transaction should be reverted")
		}
	})

	// Untestable: The blockchain timestamp can't be altered
	// it("should reject a check-in before the right time")

	it("should allow to check-in and pay the hotel", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)

		const hotelBalancePre = await web3.eth.getBalance(hotelAccount)

		await bookingsInstance.checkIn({ value: deposit, from: guestAccount })

		const hotelBalancePost = await web3.eth.getBalance(hotelAccount)

		let expected = hotelBalancePre.plus(price)

		assert(hotelBalancePost.eq(expected), "The hotel's balance should have increased by 0.3 ether")

		occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(occupied)
	})

	it("should allow to check-out and refund the deposit", async function () {
		let occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(occupied)

		const guestBalancePre = await web3.eth.getBalance(guestAccount)

		const tx = await bookingsInstance.checkOut({ from: guestAccount })
		
		const guestBalancePost = await web3.eth.getBalance(guestAccount)
		
		let expected = guestBalancePre.plus(price)
		expected = expected.minus(web3.toBigNumber(tx.receipt.gasUsed).times(testingGasPrice));

		assert(guestBalancePost.eq(expected), "The guest's balance should have increased by 0.3 ether minus gas")

		occupied = await bookingsInstance.hasGuestCheckedIn.call()
		assert.isOk(!occupied)
	})

	// Untestable: The blockchain timestamp can't be altered
	// it("should allow the hotel to force check out if late")
})
