const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receptionist = new Schema(
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
		hotel: mongoose.Schema.Types.ObjectId,
	},
	{
		timestamps: true,
	}
);

const Receptionist = model("Receptionist", receptionist);

module.exports = Receptionist;
