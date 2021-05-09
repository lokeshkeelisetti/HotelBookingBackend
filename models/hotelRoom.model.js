const { Schema, model } = require("mongoose");

const hotelRoomSchema = new Schema(
	{
		roomNo: {
			type: String,
			required: true,
		},
		hotelId: {
			type: String,
			required: true,
		},
		hotelRoomType: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
		bookingDates: {
			type: [
				{
					startDate: {
						type: Date,
						required: true,
					},
					endDate: {
						type: Date,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const HotelRoom = model("HotelRoom", hotelRoomSchema);

module.exports = HotelRoom;
