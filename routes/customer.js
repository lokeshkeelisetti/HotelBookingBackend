const router = require("express").Router();
let Customer = require("../models/customer.model");
let Rating = require("../models/rating.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");
let HotelRoomType = require("../models/hotelRoomType.model");
const md5 = require("md5");
// let Hotel = require("../models/hotel.model");

const checkLogin = (userType, userSecret) => {
	if (userType == "customer" && userSecret == process.env.CUSTOMER_SECRET) return true;
	else return false;
};

router.route("/findHotel").get((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		HotelRoomType.find()
			.then((hotelRoomTypes) => res.json(hotelRoomTypes))
			.catch((err) => res.json({ failure: "Unable to find room type", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/changePassword").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Customer.findOne({ _id: req.body.customerId, password: md5(req.body.oldPassword) })
			.then((customer) => {
				customer.password = md5(req.body.newPassword);
				customer
					.save()
					.then(() => res.json({ success: "Password updated successfully" }))
					.catch((err) =>
						res.json({
							failure: "Unable to update password",
							error: err,
						})
					);
			})
			.catch((err) =>
				res.json({ failure: "Unable to find user with given credentials", error: err })
			);
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/bookRoom").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		HotelRoom.find({
			hotelRoomTypeId: req.body.hotelRoomTypeId,
			hotelId: req.body.hotelId,
		}).then((hotelRooms) => {
			var i = 0;
			var roomId = "";
			var valid = 1;
			console.log(hotelRooms);
			while (hotelRooms[i]) {
				bookingDates = hotelRooms[i].bookingDates;
				var j = 0;
				sd = new Date(req.body.startDate);
				ed = new Date(req.body.endDate);

				while (bookingDates[j]) {
					bsd = new Date(bookingDates[j].startDate);
					bed = new Date(bookingDates[j].endDate);
					j++;
					if (
						(bsd <= sd && sd <= bed) ||
						(bsd <= ed && ed <= bed) ||
						(sd <= bsd && bsd <= ed) ||
						(sd <= bed && bed <= ed)
					) {
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

			console.log(i);

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
														res.json({
															success: "Booking created successfully",
														});
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
		});
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/cancelBooking/:id").delete((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Booking.findOneAndDelete({ _id: req.params.id, customerId: req.headers.customerid })
			.then((booking) => {
				HotelRoom.findById(booking.hotelRoomId).then((room) => {
					room.bookingDates = room.bookingDates.filter((date) => {
						return (
							String(date.startDate) != String(booking.duration.startDate) ||
							String(date.endDate) != String(booking.duration.endDate)
						);
					});
					room.save()
						.then(() => {
							Customer.findById(booking.customerId)
								.then((currentCustomer) => {
									currentCustomer.upcomingBookingIds =
										currentCustomer.upcomingBookingIds.filter((id) => {
											return id != booking._id;
										});
									currentCustomer
										.save()
										.then(() => {
											res.json({
												success: "Booking cancelled successfully",
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
							res.json({ failure: "Unable to cancel booking", error: err })
						);
				});
			})
			.catch((err) => res.json({ failure: "Unable to cancel booking1", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/addRating").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		var rating = {
			customerId: req.body.customerId,
			ratingValue: Number(req.body.ratingValue),
			hotelId: req.body.hotelId,
			comment: req.body.comment,
		};

		const newRating = new Rating(rating);

		Booking.findOne({
			status: true,
			customerId: req.body.customerId,
			hotelId: req.body.hotelId,
			rating: false,
			_id: req.body.bookingId,
		})
			.then((booking) => {
				booking.rating = true;
				console.log(booking);

				booking
					.save()
					.then(() => {
						newRating
							.save()
							.then(() => res.json({ success: "Rating added!" }))
							.catch((err) =>
								res.json({ failure: "Unable to add rating", error: err })
							);
					})
					.catch((err) =>
						res.json({ failure: "Unable to save booking status", error: err })
					);
			})
			.catch((err) => res.json({ failure: "Unable to find booking", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/updateRating").put((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Rating.findOne({
			_id: req.body.ratingId,
			customerId: req.body.customerId,
			hotelId: req.body.hotelId,
		})
			.then((rating) => {
				rating.ratingValue = Number(req.body.ratingValue);
				rating.comment = req.body.comment;
				rating
					.save()
					.then(() => res.json({ success: "Rating updated!" }))
					.catch((err) => res.json({ failure: "Unable to update rating", error: err }));
			})
			.catch((err) =>
				res.json({ failure: "Unable to find rating witth specified Id", error: err })
			);
	} else {
		res.json({ failure: "Access Denied" });
	}
});

module.exports = router;
