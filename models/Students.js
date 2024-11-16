var mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  matric_number: String,
  faculty: String,
  deparment: String,
  next_of_kin: String,
  phone_number: String,
  next_of_kin_address: String,
  next_of_kin_phone_number: String,
  phone_number: String,
  onAppointment: {
    default: false,
    type: Boolean,
  },
  diabetic: {
    default: false,
    type: Boolean,
  },
  ulcer: {
    default: false,
    type: Boolean,
  },
  hypertensive: {
    default: false,
    type: Boolean,
  }
});

module.exports = mongoose.model("Student", studentSchema);
