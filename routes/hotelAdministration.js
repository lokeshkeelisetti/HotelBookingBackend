const router = require("express").Router();
let HotelAdministration = require("../models/hotelAdministration.model");
let Receptionist = require("../models/receptionist.model");
let HotelRoom = require("../models/hotelRoom.model");
let Hotel = require("../models/hotel.model");

router.route("/").get((req, res) => {
	HotelAdministration.find()
		.then((hotelAdmins) => res.json(hotelAdmins))
		.catch((err) => res.status(400).json("Error finding admin" + err));
});

router.route("/addRoom").post((req, res) => {
	hotelRoom = {
		hotelRoomType: req.body.hotelRoomType,
		hotelId: req.body.hotelId,
		roomNo: req.body.roomNo,
		status: 0, //default status is '0' for free room
	};

	const newRoom = new HotelRoom(hotelRoom);

	Hotel.findById(req.body.hotelId)
		.then(() => {
			newRoom
				.save()
				.then(() => res.json({ success: "Room added successfully" }))
				.catch((err) =>
					res.status(400).json({ failure: "Unable to add room", error: err })
				);
		})
		.catch((err) => res.status(400).json({ failure: "Unable to find hotel", error: err }));
});

// adding receptionist by hotel admin
router.route("/addReceptionist").post((req, res) => {
	receptionist = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password, //adding default password later he can update
		hotelId: req.body.hotelId,
	};

	const newReceptionist = new Receptionist(receptionist);

	newReceptionist
		.save()
		.then(() => res.json({ success: "Receptionist added successfully" }))
		.catch((err) =>
			res.status(400).json({ failure: "Unable to add receptionist", error: err })
		);
});

module.exports = router;
