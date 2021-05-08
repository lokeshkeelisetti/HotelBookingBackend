const { Schema, model } = require("mongoose");

const hotelAdministration = new Schema(
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
		hotel: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const HotelAdministration = model("HotelAdministration", hotelAdministration);

module.exports = HotelAdministration;
