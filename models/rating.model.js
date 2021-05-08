const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rating = new Schema(
	{
		rating_value: {
			type: Number,
			required: true,
			validate: (val) => {
				return val <= 5 && val >= 1;
			},
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
		},
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
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
