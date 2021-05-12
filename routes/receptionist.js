const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let Booking = require("../models/booking.model");
let HotelRoom = require("../models/hotelRoom.model");
let Receptionist = require("../models/receptionist.model");
const md5 = require("md5");

// add RECEPTIONIST_SECRET to env file!!
const checkLogin = (userType, userSecret) => {
	if (userType == "receptionist" && userSecret == process.env.RECEPTIONIST_SECRET) return true;
	else return false;
};

router.route("/changePassword").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Receptionist.findOne({
			_id: req.body.id,
			password: md5(req.body.oldPassword),
		})
			.then((receptionist) => {
				receptionist.password = md5(req.body.newPassword);
				receptionist
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

//Confirm booking or update status in booking
router.route("/updateStatus/:id").put((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Receptionist.findOne({ _id: req.body.receptionistId, hotelId: req.body.hotelId })
			.then(() => {
				Booking.findOne({ _id: req.params.id, hotelId: req.body.hotelId })
					.then((booking) => {
						booking.status = true;
						booking
							.save()
							.then(() => res.json({ success: "hotel room is confirmed!" }))
							.catch((err) =>
								res.json({ failure: "Unable to confirm hotel room", error: err })
							);
					})
					.catch((err) =>
						res.json({
							failure: "Unable to find particular booking with given id",
							error: err,
						})
					);
			})
			.catch((err) => res.json({ failure: "Unable to find hotel", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

module.exports = router;
