var mongoose = require("mongoose");
//Set up default mongoose connection
const prescriptionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  drugs: {
    type: String
  },
  prescription_fulfilled: {
    type: Boolean, 
    default: false
  },
  unavailable_medications:String
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
