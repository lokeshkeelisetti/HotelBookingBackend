const { Schema, model } = require("mongoose");

const hotel = new Schema(
	{
		hotel_name: {
			type: String,
			required: true,
		},
		address: {
			street: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			pinCode: {
				type: Number,
				required: true,
			},
		},
		rooms: [String],
		imgURL: [String],
	},
	{
		timestamps: true,
	}
);

const Hotel = model("Hotel", hotel);

module.exports = Hotel;
