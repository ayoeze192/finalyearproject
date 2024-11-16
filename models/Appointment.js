var mongoose = require("mongoose");
const User = require("./User");
//Set up default mongoose connection
const appointmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patient: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  completed: {
    type: Boolean,
    default: false,
  },
  temperature: Number,
  systolic_pressure: Number,
  diastolic_pressure: Number,
  filled: Boolean,
  prescription: String,
  weight: String,
  sorted_prescription: Boolean,
  observation: String
})

module.exports = mongoose.model("Appointment", appointmentSchema);
