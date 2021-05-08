const { Schema, model } = require("mongoose");

const ratingSchema = new Schema(
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

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
