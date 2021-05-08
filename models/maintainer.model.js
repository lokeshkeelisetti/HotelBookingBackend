const { Schema, model } = require("mongoose");

const maintainer = new Schema(
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
	},
	{
		timestamps: true,
	}
);

const Maintainer = model("Maintainer", maintainer);

module.exports = Maintainer;
