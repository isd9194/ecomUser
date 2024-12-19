const { required } = require("joi");
const mongoose = require("mongoose");

const obj = {
  name: {
    type: String,
    required: true, // Validation: Field is required
    minlength: 2, // Minimum length of 5 characters
  },
  email: {
    type: String,
    required: true,
    unique: true, // Validation: Unique email
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  create_by: { type: String },
};

// Define a schema
const userSchema = new mongoose.Schema(obj);

// Create a model based on the schema
const User_schema = mongoose.model("users", userSchema);

// Export the model for use in other files
module.exports = User_schema;
