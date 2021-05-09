const router = require("express").Router();
let HotelAdministration = require("../models/hotelAdministration.model");
let Receptionist = require("../models/receptionist.model");
let HotelRoomType = require("../models/HotelRoomType.model");

router.route("/").get((req, res) => {
	HotelAdministration.find()
		.then((hotelAdministrations) => res.json(hoteladministrations))
		.catch((err) => res.status(400).json("Error finding admin" + err));
});

router.route("/addRoom").post((req, res) => {
	hotelType = req.body.hotelType;
	hotelId = req.body.hotelId;
	roomNo = req.body.roomNo;
	const newRoom = new HotelRoom({ roomNo, hotelId,hotelType,"0"});//default status is '0' for not nookin

	newRoom
		.save()
		.then(() => res.json({ success: "Room added successfully" }))
		.catch((err) => res.status(400).json({ failure: "Unable to add room", error: err }));
});



router.route("/").get((req, res) => {
	HotelAdministration.find()
		.then((hotelAdministrations) => res.json(hoteladministrations))
		.catch((err) => res.status(400).json("Error finding admin" + err));
});

router.route("/addReceptionist").post((req, res) => {
	firstName = req.body.firstName;
	lastName = req.body.lastName;
	email = req.body.email;
	password = req.body.password; //adding default password later he can update
	hotelId = req.body.hotelId;
	const newReceptionist = new HotelRoom({ roomNo, hotelId,hotelType,"0"});//default status is '0' for not nookin

	newRoom
		.save()
		.then(() => res.json({ success: "Receptionist added successfully" }))
		.catch((err) => res.status(400).json({ failure: "Unable to add receptionist", error: err }));
});
