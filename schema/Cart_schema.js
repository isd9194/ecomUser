const { required } = require("joi");
const mongoose = require("mongoose");

const obj = {
//   title: {
//     type: String,
//     required: true, // Validation: Field is required
//     minlength: 2, // Minimum length of 5 characters
//   },
//   description: {
//     type: String,
//     required: true, // Validation: Field is required
//     minlength: 2, // Minimum length of 5 characters
//   },
//   due_date: {
//     type: Number,
//     required: true, // Validation: Field is required
//   },
item_id:{type:String},
  created_date: {
    type: Date,
    required: true, // Validation: Field is required
    default: Date.now,
  },
 

  create_by: { type: String },
  quantity : {type : Number ,
    default :1 
  }
  
};

// Define a schema
const cartSchema = new mongoose.Schema(obj);

// Create a model based on the schema
const Cart_schema = mongoose.model("cart", cartSchema);

// Export the model for use in other files
module.exports = Cart_schema;
