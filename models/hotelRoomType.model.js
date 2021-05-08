const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelRoomType = new Schema(
	{
		type: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		facilities: {
			ac_or_not: {
				type: Boolean,
				default: false,
			},
			wifi_or_not: {
				type: Boolean,
				default: false,
			},
			max_no_of_people: {
				type: Number,
				required: true,
			},
		},
		type: {
			type: String,
			required: true,
		},
		imgURL: [String],
	},
	{
		timestamps: true,
	}
);

const HotelRoomType = model("HotelRoomType", hotelRoomType);

module.exports = HotelRoomType;
