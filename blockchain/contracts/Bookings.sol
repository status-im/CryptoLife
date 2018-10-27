pragma solidity ^0.4.24;

contract Bookings {
	struct Booking {
		address guest;
		uint checkInAfter;
		uint checkOutUntil;
	}
	address checkedInGuest;
	address hotelAccount;
	uint deposit;         // check in deposit
	uint price;           // room price

	// day timestamp start => Booking {}
	mapping (uint => Booking) bookings;

	event Booked(address guest);
	event CheckedIn(address guest);
	event CheckedOut(address guest);

	constructor(address _hotelAccount, uint _price, uint _deposit) public {
		hotelAccount = _hotelAccount;
		price = _price;
		deposit = _deposit;
	}

	function isAvailable(uint timestamp) public view returns(bool) {
		// The date's timestamp at 00:00 UTC
		uint dayStart = timestamp - (timestamp % 86400);
		return bookings[dayStart].guest != 0x0;
	}

	function bookRoom(uint timestamp) public payable {
		// The date's timestamp at 00:00 UTC
		uint dayStart = timestamp - (timestamp % 86400);

		require(bookings[dayStart].guest == 0x0, "Already reserved");
		require(msg.value == price, "Invalid amount");

		bookings[dayStart].guest = msg.sender;
		bookings[dayStart].checkInAfter = dayStart + 46800; // 13:00h
		bookings[dayStart].checkOutUntil = dayStart + 126000;  // 11:00h +1 day
	}

	function cancelBooking(uint timestamp) public {
		// The date's timestamp at 00:00 UTC
		uint dayStart = timestamp - (timestamp % 86400);

		require(bookings[dayStart].guest == msg.sender, "Invalid guest");

		bookings[dayStart].guest = 0x0;
		bookings[dayStart].checkInAfter = 0;
		bookings[dayStart].checkOutUntil = 0;

		// total refund
		if(now < (bookings[dayStart].checkInAfter - 172800)) { // more than 48h left
			msg.sender.transfer(price);
		}
		else if(now < (bookings[dayStart].checkInAfter - 86400)) { // between 24-48h left
			msg.sender.transfer(price/2);
		}
	}

	function checkIn() public payable {
		// The date's timestamp at 00:00 UTC
		uint dayStart = now - (now % 86400);

		require(checkedInGuest == 0x0, "A guest is already checked in");
		require(bookings[dayStart].guest == msg.sender, "Invalid guest");
		require(bookings[dayStart].checkInAfter < now, "Check in not yet available");
		require(deposit == msg.value, "Invalid deposit");

		hotelAccount.transfer(price);
		checkedInGuest = msg.sender;
	}

	function checkOut(uint spentAmount, bytes32 signedSettlement) public payable {
		// The date's timestamp at 00:00 UTC
		uint dayStart = now - (now % 86400);

		require(checkedInGuest != 0x0, "Nobody is checked in");
		require(spentAmount < deposit, "Invalid spentAmount");

		// guest checks himself out
		if(msg.sender == bookings[dayStart].guest){
			if(bookings[dayStart].checkOutUntil > now){
				// OK


				// TODO: check settlement


				checkedInGuest = 0x0;
				msg.sender.transfer(deposit - spentAmount);
			}
			else {
				// penalty, no deposit refund
				checkedInGuest = 0x0;
			}
		}
		// the hotel forces a check out when out of time
		else if(msg.sender == hotelAccount) {
			require(bookings[dayStart].checkOutUntil < now, "Too early to check out");
			checkedInGuest = 0x0;
		}
		else {
			revert();
		}
	}
}
