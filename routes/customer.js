const router = require("express").Router();
let Customer = require("../models/customer.model");
let Rating = require("../models/rating.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");
let HotelRoomType = require("../models/hotelRoomType.model");
let Hotel = require("../models/hotel.model");

router.route("/").get((req, res) => {
	Customer.find()
		.then((customers) => res.json(customers))
		.catch((err) => res.json({ failure: "Unable to find customers", error: err }));
});

router.route("/findHotel").get((req, res) => {
	HotelRoomType.find()
		.then((hotelRoomTypes) => res.json(hotelRoomTypes))
		.catch((err) => res.json({ failure: "Unable to find room type", error: err }));
});

router.route("/bookRoom").post((req, res) => {
	HotelRoom.find({ hotelRoomTypeId: req.body.hotelRoomTypeId, hotelId: req.body.hotelId }).then(
		(hotelRooms) => {
			var i = 0;
			var roomId = "";
			var valid = 1;
			// console.log(hotelRooms);
			while (hotelRooms[i]) {
				bookingDates = hotelRooms[i].bookingDates;
				var j = 0;
				sd = new Date(req.body.startDate);
				ed = new Date(req.body.endDate);

				while (bookingDates[j]) {
					bsd = new Date(bookingDates[j].startDate);
					bed = new Date(bookingDates[j].endDate);
					j++;
					if ((bsd <= sd && sd <= bed) || (bsd <= ed && ed <= bed)) {
						valid = 0;
						break;
					}
				}

				// console.log(i, " ", j);

				if (j == 0) valid = 1;

				if (valid) {
					roomId = hotelRooms[i]._id;
					break;
				}

				i++;
			}

			// console.log(i);

			if (i == 0) valid = 0;

			if (valid) {
				booking = {
					customerId: req.body.customerId,
					hotelRoomId: roomId,
					hotelId: req.body.hotelId,
					duration: {
						startDate: req.body.startDate,
						endDate: req.body.endDate,
					},
				};

				const newBooking = new Booking(booking);

				newBooking
					.save()
					.then((currentBooking) => {
						HotelRoom.findById(roomId)
							.then((hotelRoom) => {
								hotelRoom.bookingDates = [
									{
										startDate: req.body.startDate,
										endDate: req.body.endDate,
									},
									...hotelRoom.bookingDates,
								];
								hotelRoom
									.save()
									.then(() => {
										Customer.findById(req.body.customerId)
											.then((customer) => {
												customer.upcomingBookingIds = [
													currentBooking._id,
													...customer.upcomingBookingIds,
												];
												customer
													.save()
													.then(() => {
														HotelRoomType.findById(
															req.body.hotelRoomTypeId
														)
															.then((currentRoomType) => {
																currentRoomType.bookingDates = [
																	{
																		startDate:
																			req.body.startDate,
																		endDate: req.body.endDate,
																	},
																	...currentRoomType.bookingDates,
																];

																currentRoomType
																	.save()
																	.then(() =>
																		res.json({
																			success:
																				"Booking created successfully",
																		})
																	)
																	.catch((err) =>
																		res.json({
																			failure:
																				"Unable to create booking",
																			error: err,
																		})
																	);
															})
															.catch((err) =>
																res.json({
																	failure:
																		"Unable to create booking",
																	error: err,
																})
															);
													})
													.catch((err) =>
														res.json({
															failure: "Unable to create booking",
															error: err,
														})
													);
											})
											.catch((err) =>
												res.json({
													failure: "Unable to create booking",
													error: err,
												})
											);
									})
									.catch((err) =>
										res.json({
											failure: "Unable to create booking",
											error: err,
										})
									);
							})
							.catch((err) =>
								res.json({ failure: "Unable to create booking", error: err })
							);
					})
					.catch((err) => res.json({ failure: "Unable to create booking", error: err }));
			} else res.json({ failure: "Room not available" });
		}
	);
});

router.route("/cancelBooking/:id").delete((req, res) => {
	Booking.findByIdAndDelete(req.params.id)
		.then((booking) => {
			HotelRoom.findById(booking.hotelRoomId).then((room) => {
				room.bookingDates = room.bookingDates.filter((date) => {
					console.log(date.startDate);
					console.log(booking.duration.startDate);
					console.log(date.endDate);
					console.log(booking.duration.endDate);
					return (
						String(date.startDate) != String(booking.duration.startDate) ||
						String(date.endDate) != String(booking.duration.endDate)
					);
				});
				console.log(room.bookingDates);
				room.save()
					.then((room1) => {
						HotelRoomType.findById(room1.hotelRoomTypeId)
							.then((currentRoomType) => {
								currentRoomType.bookingDates = currentRoomType.bookingDates.filter(
									(date1) => {
										return (
											String(date1.startDate) !=
												String(booking.duration.startDate) ||
											String(date1.endDate) !=
												String(booking.duration.endDate)
										);
									}
								);
								currentRoomType
									.save()
									.then(() => {
										Customer.findById(booking.customerId)
											.then((currentCustomer) => {
												currentCustomer.upcomingBookingIds = currentCustomer.upcomingBookingIds.filter(
													(id) => {
														return id != booking._id;
													}
												);
												currentCustomer
													.save()
													.then(() => {
														res.json({
															success:
																"Booking cancelled successfully",
														});
													})
													.catch((err) =>
														res.json({
															failure: "Unable to cancel booking",
															error: err,
														})
													);
											})
											.catch((err) =>
												res.json({
													failure: "Unable to cancel booking",
													error: err,
												})
											);
									})
									.catch((err) =>
										res.json({
											failure: "Unable to cancel booking",
											error: err,
										})
									);
							})
							.catch((err) =>
								res.json({ failure: "Unable to cancel booking", error: err })
							);
					})
					.catch((err) => res.json({ failure: "Unable to cancel booking", error: err }));
			});
		})
		.catch((err) => res.json({ failure: "Unable to cancel booking", error: err }));
});

router.route("/addRating").post((req, res) => {
	var rating = {
		customerId: req.body.customerId,
		ratingValue: Number(req.body.ratingValue),
		hotelId: req.body.hotelId,
		comment: req.body.comment,
	};

	const newRating = new Rating(rating);

	Hotel.find({ hotelId })
		.then(() => {
			newRating
				.save()
				.then(() => res.json({ success: "Rating added!" }))
				.catch((err) => res.json({ failure: "Unable to add rating", error: err }));
		})
		.catch((err) => res.json({ failure: "Unable to find hotel", error: err }));
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
				.catch((err) => res.json({ failure: "Unable to update rating", error: err }));
		})
		.catch((err) =>
			res
				.status(400)
				.json({ failure: "Unable to find rating witth specified Id", error: err })
		);
});

module.exports = router;
