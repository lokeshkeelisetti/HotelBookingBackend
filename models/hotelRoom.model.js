const { Schema, model } = require("mongoose");

const hotelRoom = new Schema(
	{
		room_no: {
			type: String,
			required: true,
		},
		hotel: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const HotelRoom = model("HotelRoom", hotelRoom);

module.exports = HotelRoom;
