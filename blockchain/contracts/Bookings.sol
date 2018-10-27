pragma solidity ^0.4.24;

import "./DateTime.sol";

contract Bookings {
    struct Booking {
        address guest;
        uint checkInFrom;
        uint checkOutUntil;
    }
    // to allow a user retrieve his/her current booking
    // probably easier to do in another way
    struct GuestDate {
        uint16 year;
        uint8 month;
        uint8 day;
    }
    address checkedInGuest;
    address hotelAccount;
    uint public deposit;         // check-in deposit
    uint public price;           // room price

    // year / month / day => Booking {}
    mapping (uint16 => mapping(uint8 => mapping(uint8 => Booking))) bookings;
    mapping (address => GuestDate) guestDates;

    event Booked(address guest);
    event Canceled(address guest);
    event CheckedIn(address guest);
    event CheckedOut(address guest);

    constructor(address _hotelAccount, uint _price, uint _deposit) public {
        hotelAccount = _hotelAccount;
        
        if(_price > 0) price = _price;
        else price = 0.3 ether;

        if(_deposit > 0) deposit = _deposit;
        else deposit = 0.3 ether;
    }

    function isAvailable(uint16 year, uint8 month, uint8 day) public view returns(bool) {
        return bookings[year][month][day].guest == 0x0;
    }

    function hasGuestCheckedIn() public view returns(bool) {
        return checkedInGuest != 0x0;
    }

    function getBooking() public view returns(uint16, uint8, uint8) {
        return (guestDates[msg.sender].year, guestDates[msg.sender].month, guestDates[msg.sender].day);
    }

    function canCheckIn() public view returns(bool) {
        uint16 year = DateTime.getYear(now);
        uint8 month = DateTime.getMonth(now);
        uint8 day = DateTime.getDay(now);

        if(hasGuestCheckedIn()) return false;
        // NOTE: also return false if it's too early
        return bookings[year][month][day].guest == msg.sender;
    }

    function canCheckOut() public view returns(bool) {
        if(!hasGuestCheckedIn()) return false;
        return checkedInGuest == msg.sender;
    }

    function bookRoom(uint16 year, uint8 month, uint8 day) public payable {
        require(isAvailable(year, month, day), "Already reserved");
        require(msg.value == price, "Invalid amount");

        bookings[year][month][day].guest = msg.sender;
        // bookings[year][month][day].checkInFrom = DateTime.toTimestamp(year, month, day, "CURRENT HOUR HERE IF NEEDED TO TEST");
        bookings[year][month][day].checkInFrom = DateTime.toTimestamp(year, month, day, 13);
        bookings[year][month][day].checkOutUntil = bookings[year][month][day].checkInFrom + 60 * 60 * 22; // +22h

        guestDates[msg.sender].year = year;
        guestDates[msg.sender].month = month;
        guestDates[msg.sender].day = day;

        emit Booked(msg.sender);
    }

    function cancelBooking(uint16 year, uint8 month, uint8 day) public {
        require(bookings[year][month][day].guest == msg.sender, "Invalid guest");

        bookings[year][month][day].guest = 0x0;
        bookings[year][month][day].checkInFrom = 0;
        bookings[year][month][day].checkOutUntil = 0;

        guestDates[msg.sender].year = 0;
        guestDates[msg.sender].month = 0;
        guestDates[msg.sender].day = 0;

        // total refund
        if(now < (bookings[year][month][day].checkInFrom - 172800)) { // more than 48h left
            msg.sender.transfer(price);
        }
        else if(now < (bookings[year][month][day].checkInFrom - 86400)) { // 24h left
            msg.sender.transfer(price/2);
        }

        emit Canceled(msg.sender);
    }

    function checkIn() public payable {
        uint16 year = DateTime.getYear(now);
        uint8 month = DateTime.getMonth(now);
        uint8 day = DateTime.getDay(now);

        require(checkedInGuest == 0x0, "A guest is already checked in");
        require(bookings[year][month][day].guest == msg.sender, "Invalid guest");
        require(bookings[year][month][day].checkInFrom < now, "Check in not yet available");
        require(bookings[year][month][day].checkInFrom != 0, "Invalid timestamp");
        require(deposit == msg.value, "Invalid deposit");

        hotelAccount.transfer(price);
        checkedInGuest = msg.sender;

        emit CheckedIn(msg.sender);
    }

    function checkOut(/*uint spentAmount, bytes32 signedSettlement*/) public payable {
        uint16 year = DateTime.getYear(now);
        uint8 month = DateTime.getMonth(now);
        uint8 day = DateTime.getDay(now);

        require(checkedInGuest != 0x0, "Nobody is checked in");
        // require(spentAmount < deposit, "Invalid spentAmount");

        // the guest checks himself out
        if(msg.sender == bookings[year][month][day].guest){
            if(bookings[year][month][day].checkOutUntil > now){

                // TODO: check state channel settlement

                checkedInGuest = 0x0;
                msg.sender.transfer(deposit);
                // msg.sender.transfer(deposit - spentAmount);
            }
            else {
                // penalty, no deposit refund
                checkedInGuest = 0x0;
            }
        }
        // the hotel forces a check out when out of time
        else if(msg.sender == hotelAccount) {
            require(bookings[year][month][day].checkOutUntil < now, "Too early to check out");
            checkedInGuest = 0x0;
        }
        else {
            revert();
        }

        emit CheckedOut(msg.sender);
    }
}
