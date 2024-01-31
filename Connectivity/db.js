const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/chatDB");
		console.log("Mongodb is connected");
	} catch (error) {
		console.log("Connection failed");
	}
};

module.exports = {connectDb,mongoose};
