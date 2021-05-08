const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: (value) => {
				let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				return value.match(reg);
			},
		},
		userType: {
			type: String,
			required: true,
			enum: ["customer", "admin", "receptionist", "maintainer"],
		},
		details: {
			type: mongoose.Schema.Types.ObjectId,
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

const User = model("User", user);

module.exports = User;
