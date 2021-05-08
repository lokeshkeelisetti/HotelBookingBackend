const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customer = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			default: "",
		},
		previousBookings: [booking],
		upcomingBookings: [booking],
	},
	{
		timestamps: true,
	}
);

const Customer = model("Customer", customer);

module.exports = Customer;
