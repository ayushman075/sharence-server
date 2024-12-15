const mongoose = require("mongoose");
const DB_NAME = "SharenceDatabase";

const connectDB = async () => {
  try {
    const databaseConnectionResponse = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    console.log(
      `Connected to database: ${databaseConnectionResponse.connection.host}`
    );
  } catch (error) {
    console.error("Error occurred while connecting to the database!!", error);
    process.exit(1);
  }
};

module.exports = connectDB;
