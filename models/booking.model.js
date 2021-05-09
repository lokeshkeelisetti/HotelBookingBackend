const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
	{
		customerId: {
			type: String,
			required: true,
		},
		hotelRoomId: {
			type: String,
			required: true,
		},
		hotelId: {
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

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
