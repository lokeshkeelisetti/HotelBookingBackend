const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
	{
		name: {
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				default: "",
			},
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		previous_bookings: [String],
		upcoming_bookings: [String],
	},
	{
		timestamps: true,
	}
);

const Customer = model("Customer", customerSchema);

module.exports = Customer;
