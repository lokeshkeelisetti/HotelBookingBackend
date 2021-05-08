const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rating = new Schema(
	{
		rating_value: {
			type: Number,
			required: true,
		},
		customer: {
			type: String,
			required: true,
		},
		hotel: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const Rating = model("Rating", rating);

module.exports = Rating;
