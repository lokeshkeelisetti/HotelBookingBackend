const router = require("express").Router();
let HotelAdministration = require("../models/hotelAdministration.model");
let Receptionist = require("../models/receptionist.model");
let HotelRoom = require("../models/hotelRoom.model");
let HotelRoomType = require("../models/hotelRoomType.model");
let Hotel = require("../models/hotel.model");

router.route("/addHotelType").post((req, res) => {
	hotelRoomType = {
		type: req.body.type,
		price: Number(req.body.price),
		facilities: {
			ac_or_not: Boolean(Number(req.body.ac_or_not)),
			wifi_or_not: Boolean(Number(req.body.wifi_or_not)),
			max_no_of_people: Number(req.body.max_no_of_people),
		},
		imgURLs: req.body.imgURLs || [],
		hotelId: req.body.hotelId,
		bookingDates: [],
	};

	const newHotelRoomType = new HotelRoomType(hotelRoomType);

	Hotel.findById(req.body.hotelId)
		.then(() => {
			newHotelRoomType
				.save()
				.then(() => res.json({ success: "Hotel Room Type added successfully" }))
				.catch((err) => res.json({ failure: "Unable to add hotel room type", error: err }));
		})
		.catch((err) => res.json({ failure: "Unable to find hotel", error: err }));
});

//adding room functionality
router.route("/addRoom").post((req, res) => {
	hotelRoom = {
		hotelRoomTypeId: req.body.hotelRoomTypeId,
		hotelId: req.body.hotelId,
		roomNo: req.body.roomNo,
	};

	const newRoom = new HotelRoom(hotelRoom);

	Hotel.findById(req.body.hotelId)
		.then(() => {
			HotelRoomType.find({ _id: req.body.hotelRoomTypeId, hotelId: req.body.hotelId })
				.then(() => {
					newRoom
						.save()
						.then(() => res.json({ success: "Room added successfully" }))
						.catch((err) => res.json({ failure: "Unable to add room", error: err }));
				})
				.catch((err) =>
					res.json({ failure: "Unable to find hotel room type", error: err })
				);
		})
		.catch((err) => res.json({ failure: "Unable to find hotel", error: err }));
});

router.route("/deleteRoom/:id").delete((req, res) => {
	HotelRoom.findByIdAndDelete(req.params.id)
		.then(() => res.json("Removed hotel room!"))
		.catch((err) => res.json({ failure: "Unable to remove hotel room", error: err }));
});

router.route("/addReceptionist").post((req, res) => {
	receptionist = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		hotelId: req.body.hotelId,
	};

	const newReceptionist = new Receptionist(receptionist);

	newReceptionist
		.save()
		.then(() => res.json({ success: "Receptionist added successfully" }))
		.catch((err) => res.json({ failure: "Unable to add receptionist", error: err }));
});

router.route("/removeReceptionist/:id").delete((req, res) => {
	Receptionist.findByIdAndDelete(req.params.id)
		.then(() => res.json("Removed receptionist!"))
		.catch((err) => res.json({ failure: "Unable to remove receptionist", error: err }));
});

router.route("/updateHotelRoomType/:id").put((req, res) => {
	HotelRoomType.findById(req.params.id)
		.then((hotelRoomType) => {
			hotelRoomType.price = Number(req.body.price);
			hotelRoomType.facilities.ac_or_not = Boolean(Number(req.body.ac_or_not));
			hotelRoomType.facilities.wifi_or_not = Boolean(Number(req.body.wifi_or_not));
			hotelRoomType.max_no_of_people = Number(req.body.max_no_of_people);
			hotelRoomType.imgURLs = req.body.imgURLs;
			hotelRoomType
				.save()
				.then(() => res.json({ success: "Type of hotel room updated!" }))
				.catch((err) => res.json({ failure: "Unable to update hotel type", error: err }));
		})
		.catch((err) =>
			res
				.status(400)
				.json({ failure: "Unable to find hotel room type with specified Id", error: err })
		);
});

module.exports = router;
