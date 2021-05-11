const router = require("express").Router();
let HotelRoomType = require("../models/hotelRoomType.model");
let Customer = require("../models/customer.model");
let HotelAdministration = require("../models/hotelAdministration.model");
let Receptionist = require("../models/receptionist.model");
let Maintainer = require("../models/maintainer.model");

const checkMaintainer = (email, password, res) => {
	Maintainer.find({ email: email })
		.then((maintainer) => {
			if (maintainer[0].password != password)
				res.json({ error: "Incorrect Email or Password" });
			else
				res.json({
					success: "User verified",
					type: "maintainer",
					secret: process.env.MAINTAINER_SECRET,
					id: maintainer[0]._id,
				});
		})
		.catch((err) => res.json({ failure: "Unable to find User", error: err }));
};

const checkReceptionist = (email, password, res) => {
	Receptionist.find({ email: email })
		.then((receptionist) => {
			if (receptionist[0].password != password)
				res.json({ error: "Incorrect Email or Password" });
			else
				res.json({
					success: "User verified",
					type: "receptionist",
					secret: process.env.RECEPTIONIST_SECRET,
					id: receptionist[0]._id,
				});
		})
		.catch((err) => checkMaintainer(email, password, res));
};

const checkHotelAdmin = (email, password, res) => {
	HotelAdministration.find({ email: email })
		.then((hotelAdministration) => {
			if (hotelAdministration[0].password != password)
				res.json({ error: "Incorrect Email or Password" });
			else
				res.json({
					success: "User verified",
					type: "hotelAdministration",
					secret: process.env.HOTELADMIN_SECRET,
					id: hotelAdministration[0]._id,
				});
		})
		.catch((err) => checkReceptionist(email, password, res));
};

const checkCustomer = (email, password, res) => {
	Customer.find({ email: email })
		.then((customer) => {
			// console.log(customer);
			if (customer[0].password != password)
				res.json({ error: "Incorrect Email or Password" });
			else
				res.json({
					success: "User verified",
					type: "customer",
					secret: process.env.CUSTOMER_SECRET,
					id: customer[0]._id,
				});
		})
		.catch((err) => checkHotelAdmin(email, password, res));
};

router.route("/findHotel").get((req, res) => {
	HotelRoomType.find()
		.then((hotelRoomTypes) => res.json(hotelRoomTypes))
		.catch((err) => res.json({ failure: "Unable to find room type", error: err }));
});

router.route("/login").post((req, res) => {
	email = req.body.email;
	password = req.body.password;
	checkCustomer(email, password, res);
});

router.route("/registerCustomer").post((req, res) => {
	const customer = {
		name: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		},
		email: req.body.email,
		password: req.body.password,
	};
	const newCustomer = new Customer(customer);

	newCustomer
		.save()
		.then(() => res.json({ success: "Customer created!" }))
		.catch((err) => res.json({ failure: "Unable to create customer", error: err }));
});

router.route("/registerMaintainer").post((req, res) => {
	const maintainer = {
		name: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		},
		email: req.body.email,
		password: req.body.password,
	};
	const newMaintainer = new Maintainer(maintainer);

	newMaintainer
		.save()
		.then(() => res.json({ success: "Maintainer created!" }))
		.catch((err) => res.json({ failure: "Unable to create Maintainer", error: err }));
});

module.exports = router;
