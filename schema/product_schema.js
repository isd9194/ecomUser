const { required } = require("joi");
const mongoose = require("mongoose");

const obj = {
  title: {
    type: String,
    required: true, // Validation: Field is required
    minlength: 2, // Minimum length of 5 characters
  },
  description: {
    type: String,
    required: true, // Validation: Field is required
    minlength: 2, // Minimum length of 5 characters
  },
  due_date: {
    type: Number,
    required: true, // Validation: Field is required
  },
  completed_date: {
    type: Date,
  },
  created_date: {
    type: Date,
    required: true, // Validation: Field is required
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "working"],
    default: "pending",
  },
  priority: {
    type: String,
    required: true,
    enum: ["high", "medium", "low"],
    default: "low",
  },
  create_by: { type: String },
  assigned_to: { type: String },
};

// Define a schema
const productSchema = new mongoose.Schema(obj);

// Create a model based on the schema
const product_schema = mongoose.model("tasks", productSchema);

// Export the model for use in other files
module.exports = product_schema;
