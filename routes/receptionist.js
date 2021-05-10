const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");

// add RECEPTIONIST_SECRET to env file!!
const checkLogin = (userType, userSecret) => {
	if (userType == "receptionist" && userSecret == process.env.RECEPTIONIST_SECRET) return true;
	else return false;
};





module.exports = router;
