const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let HotelAdministration = require("../models/hotelAdministration.model");
let Customer = require("../models/customer.model");
let Receptionist = require("../models/receptionist.model");
let Maintainer = require("../models/maintainer.model");

const checkLogin = (userType, userSecret) => {
	if (userType == "maintainer" && userSecret == process.env.MAINTAINER_SECRET) return true;
	else return false;
};

router.route("/changePassword").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Maintainer.findOne({
			_id: req.body.maintainerId,
			password: md5(req.body.oldPassword),
		})
			.then((maintainer) => {
				maintainer.password = md5(req.body.newPassword);
				maintainer
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

router.route("/hotel").get((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Hotel.find()
			.then((hotels) => res.json(hotels))
			.catch((err) => res.json({ failure: "Unable to find hotels", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/hotelAdmin").get((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		HotelAdministration.find()
			.then((hotelAdmins) => res.json(hotelAdmins))
			.catch((err) => res.json({ failure: "Unable to find hotel admins", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/customers").get((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Customer.find()
			.then((customers) => res.json(customers))
			.catch((err) => res.json({ failure: "Unable to find customers", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/addNewHotel").post((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
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
			.then((hotel) => {
				const hoteladmin = {
					name: {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
					},
					email: req.body.email,
					password: req.body.password,
					hotelId: hotel._id,
				};
				const newHotelAdministration = new HotelAdministration(hoteladmin);
				newHotelAdministration
					.save()
					.then(() => res.json({ success: "Hotel Admin and Hotel added" }))
					.catch((err) => res.json({ failure: "unable to add hotel admin", error: err }));
			})
			.catch((err) => res.json({ failure: "unable to add hotel ", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

router.route("/removeHotel/:id").delete((req, res) => {
	if (checkLogin(req.headers.usertype, req.headers.usersecret)) {
		Hotel.findByIdAndDelete(req.params.id)
			.then(() => {
				HotelAdministration.remove({ hotelId: req.params.id })
					.then(() => res.json("hotel admin and hotel deleted"))
					.catch((err) =>
						res.json({ failure: "Unable to delete hotel admin", error: err })
					);
				Receptionist.remove({ hotelId: req.params.id })
					.then(() => res.json("receptionist and hotel deleted"))
					.catch((err) =>
						res.json({ failure: "Unable to delete hotel receptionist", error: err })
					);
			})
			.catch((err) => res.json({ failure: "Unable to delete hotel", error: err }));
	} else {
		res.json({ failure: "Access Denied" });
	}
});

module.exports = router;
