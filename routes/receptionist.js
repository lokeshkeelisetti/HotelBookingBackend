const router = require("express").Router();
let Hotel = require("../models/hotel.model");


// add RECEPTIONIST_SECRET to env file!!
const checkLogin = (userType, userSecret) => {
	if (userType == "receptionist" && userSecret == process.env.RECEPTIONIST_SECRET) return true;
	else return false;
};

router.route("/").get((req, res) => {
	Hotel.find()
		.then((hotels) => res.json(hotels))
		.catch((err) => res.json("Error: " + err));
});


module.exports = router;
