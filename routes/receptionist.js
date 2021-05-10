const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");

// add RECEPTIONIST_SECRET to env file!!
const checkLogin = (userType, userSecret) => {
	if (userType == "receptionist" && userSecret == process.env.RECEPTIONIST_SECRET) return true;
	else return false;
};

//findRoom returns all the rooms whose status are free
router.route("/findRoom").get((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		HotelRoom.find()
			.then((hotelRooms) => res.json(hotelRooms))
			.catch((err) => res.json({ failure: "Unable to find rooms ", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

// update roomStatus essentially mean booking room for offline people



module.exports = router;
