const mongoose = require("mongoose");
// Database Name
const dbName = process.env.DB_NAME;

// Connection URL
const url = process.env.MONGODB_URL;

const connect_to_mongo = () => {
  mongoose.connect(`${url}/${dbName}`);
  console.log("mongoose connected");
};

module.exports = { connect_to_mongo };
