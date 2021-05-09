const router = require("express").Router();
let HotelAdministration = require("../models/hotelAdministration.model");
let Receptionist = require("../models/receptionist.model");
let HotelRoomType = require("../models/HotelRoomType.model");

//default route
router.route("/").get((req, res) => {
	HotelAdministration.find()
		.then((hotelAdmins) => res.json(hotelAdmins))
		.catch((err) => res.status(400).json("Error finding admin" + err));
});

//adding room functionality
router.route("/addRoom").post((req, res) => {
	hotelRoom = {
		hotelRoomType: req.body.hotelRoomType,
		hotelId: req.body.hotelId,
		roomNo: req.body.roomNo,
		status: 0, //default status is '0' for free room
	};

	const newRoom = new HotelRoom(hotelRoom);

	newRoom
		.save()
		.then(() => res.json({ success: "Room added successfully" }))
		.catch((err) => res.status(400).json({ failure: "Unable to add room", error: err }));
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

router.route("/removeReceptionist/:id").delete((req, res) => {
	Receptionist.findByIdAndDelete(req.params.id)
		.then(() => res.json("Successfully removed receptionist!"))
		.catch((err) => res.status(400).json({ failure: "Unable to remove receptionist . Please try again", error: err }));
});

//update facilities
router.route("/updateFacilities/:id").put((req, res) => {
	HotelRoomType.findById(req.params.id)
		.then((hotelRoomType) => {
			hotelRoomType.price = req.body.price;
			hotelRoomType.facilities.ac_or_not = req.body.ac_or_not;
			hotelRoomType.facilities.wifi_or_not = req.body.wifi_or_not;
			hotelRoomType.max_no_of_people = req.body.max_no_of_people;
			hotelRoomType
				.save()
				.then(() => res.json({ success: "Type of hotel room updated!" }))
				.catch((err) =>
					res.status(400).json({ failure: "Unable to update hotel type", error: err })
				);
		})
		.catch((err) =>
			res
				.status(400)
				.json({ failure: "Unable to find hotel room type witth specified Id", error: err })
		);
});
//removing room
router.route("/removeRoom/:id").delete((req, res) => {
	HotelRoom.findByIdAndDelete(req.params.id)
		.then(() => res.json("Removed room successfully"))
		.catch((err) => res.status(400).json({ failure: "Unable to remove room please try again", error: err }));
});

module.exports = router;
