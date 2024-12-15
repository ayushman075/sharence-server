const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  emailUpdatedAt: {
    type: Date,
  },
  emailUpdatedFromIP: {
    type: String,
  },
  emailUpdatedFromDevice: {
    type: String,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  contactNumberUpdatedAt: {
    type: Date,
  },
  contactNumberUpdatedFromIP: {
    type: String,
  },
  contactNumberUpdatedFromDevice: {
    type: String,
  },
  address: {
    type: String,
  },
  addressUpdatedAt: {
    type: Date,
  },
  addressUpdatedFromIP: {
    type: String,
  },
  addressUpdatedFromDevice: {
    type: String,
  },
});



const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;
