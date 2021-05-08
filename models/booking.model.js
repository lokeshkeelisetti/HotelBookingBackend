const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booking = new Schema(
	{
		customer: {
			type: String,
			required: true,
		},
		hotel_room: {
			type: String,
			required: true,
		},
		hotel: {
			type: String,
			required: true,
		},
		duration: {
			start_date: {
				type: Date,
				required: true,
			},
			end_date: {
				type: Date,
				required: true,
			},
		},
	},
	{
		timestamps: true,
	}
);

const Booking = model("Booking", booking);

module.exports = Booking;
