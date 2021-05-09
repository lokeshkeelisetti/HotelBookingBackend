const router = require("express").Router();
let Customer = require("../models/customer.model");
let Rating = require("../models/rating.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");
let Hotel = require("../models/hotel.model");

router.route("/").get((req, res) => {
	Customer.find()
		.then((customers) => res.json(customers))
		.catch((err) => res.status(400).json("Error: " + err));
});

router.route("/findHotel").post((req, res) => {
	city = req.body.city || "";
	hotelName = req.body.hotelName || "";
	startDate = req.body.startDate;
	endDate = req.body.endDate;

	HotelRoom.find({})
		.then((hotelRoom) => {
			var valid = 1;
			var i = 0;
			var bds = hotelRoom.bookingDates;
			while (bds[i]) {
				if (
					(bds[i].startDate <= startDate && bds[i].endDate >= startDate) ||
					(bds[i].startDate <= endDate && bds[i].endDate >= endDate)
				) {
					valid = 0;
					break;
				}
				i++;
			}
			if (valid) {
				const hotelId = hotelRoom.hotelId;
				Hotel.findById(hotelId)
					.then((hotel) => {
						if (
							hotel.hotelName.toLowerCase().indexOf(hotelName.toLowerCase()) != -1 &&
							hotel.address.city.toLowerCase().indexOf(city.toLowerCase()) != -1
						) {
							res.json(hotelRoom);
						}
					})
					.catch((err) =>
						res.status(400).json({ failure: "Unable to find room", error: err })
					);
			}
		})
		.catch((err) => res.status(400).json({ failure: "Unable to find room", error: err }));
});

router.route("/bookRoom").post((req, res) => {
	customerId = req.body.customerId;
	hotelRoomId = req.body.hotelRoomId;
	hotelId = req.body.hotelId;
	duration = {
		start_date: req.body.start_date,
		end_date: req.body.end_date,
	};

	const newBooking = new Booking({ customerId, hotelRoomId, hotelId, duration });

	newBooking
		.save()
		.then(() => res.json({ success: "Booking created!" }))
		.catch((err) => res.status(400).json({ failure: "Unable to create booking", error: err }));
});

router.route("/cancelBooking/:id").delete((req, res) => {
	Booking.findByIdAndDelete(req.params.id)
		.then((exercise) => res.json("Booking cancelled!"))
		.catch((err) => res.status(400).json({ failure: "Unable to cancel booking", error: err }));
});

router.route("/addRating").post((req, res) => {
	customerId = req.body.customerId;
	ratingValue = Number(req.body.ratingValue);
	hotelId = req.body.hotelId;
	comment = req.body.comment;

	const newRating = new Rating({ customerId, ratingValue, hotelId, comment });

	newRating
		.save()
		.then(() => res.json({ success: "Rating added!" }))
		.catch((err) => res.status(400).json({ failure: "Unable to add rating", error: err }));
});

router.route("/updateRating/:id").put((req, res) => {
	Rating.findById(req.params.id)
		.then((rating) => {
			rating.customerId = req.body.customerId;
			rating.ratingValue = Number(req.body.ratingValue);
			rating.hotelId = req.body.hotelId;
			rating.comment = req.body.comment;
			rating
				.save()
				.then(() => res.json({ success: "Rating updated!" }))
				.catch((err) =>
					res.status(400).json({ failure: "Unable to update rating", error: err })
				);
		})
		.catch((err) =>
			res
				.status(400)
				.json({ failure: "Unable to find rating witth specified Id", error: err })
		);
});

module.exports = router;
