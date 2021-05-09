const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let HotelAdministration = require("../models/hotelAdministration.model");

router.route("/hotel").get((req, res) => {
	Hotel.find()
		.then((hotels) => res.json(hotels))
		.catch((err) => res.status(400).json({ failure: "Unable to find hotels", error: err }));
});

router.route("/hotelAdmin").get((req, res) => {
	HotelAdministration.find()
		.then((hotelAdmins) => res.json(hotelAdmins))
		.catch((err) =>
			res.status(400).json({ failure: "Unable to find hotel admins", error: err })
		);
});

router.route("/addNewHotel").post((req, res) => {
	const hotel = {
		hotelName: req.body.hotelName,
		address: {
			street: req.body.street,
			city: req.body.city,
			pinCode: Number(req.body.pinCode),
		},
	};

	const newHotel = new Hotel(hotel);

	newHotel
		.save()
		.then(() => {
			Hotel.find({
				hotelName: req.body.hotelName,
				address: {
					street: req.body.street,
					city: req.body.city,
					pinCode: Number(req.body.pinCode),
				},
			})
				.then((hotel) => {
					const hoteladmin = {
						name: {
							firstName: req.body.firstName,
							lastName: req.body.lastName,
						},
						email: req.body.email,
						password: req.body.password,
						hotelId: hotel[0]._id,
					};
					const newHotelAdministration = new HotelAdministration(hoteladmin);
					newHotelAdministration
						.save()
						.then(() => res.json({ success: "Hotel Admin and Hotel added" }))
						.catch((err) =>
							res
								.status(400)
								.json({ failure: "unable to add hotel admin", error: err })
						);
				})
				.catch((err) =>
					res.status(400).json({ failure: "unable to add Hotel Admin ", error: err })
				);
		})
		.catch((err) => res.status(400).json({ failure: "unable to add hotel ", error: err }));
});

router.route("/removeHotel/:id").delete((req, res) => {
	Hotel.findByIdAndDelete(req.params.id)
		.then(() => {
			HotelAdministration.findOneAndRemove({ hotelId: req.params.id })
				.then(() => res.json("hotel admin and hotel deleted"))
				.catch((err) =>
					res.status(400).json({ failure: "Unable to delete hotel admin", error: err })
				);
		})
		.catch((err) => res.status(400).json({ failure: "Unable to delete hotel", error: err }));
});

module.exports = router;
