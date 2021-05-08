const { Schema, model } = require("mongoose");

const hotelRoomSchema = new Schema(
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

const HotelRoom = model("HotelRoom", hotelRoomSchema);

module.exports = HotelRoom;
