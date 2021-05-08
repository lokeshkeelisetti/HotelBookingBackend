const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

const uri = process.env.ATLAS_URI;

const connect = mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

connect.then(
	(db) => {
		console.log("MongoDB connected");
	},
	(err) => {
		console.log(err);
	}
);

app.use(cors());
app.use(express.json());

app.use("/", indexRouter);

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
