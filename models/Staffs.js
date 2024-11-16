var mongoose = require("mongoose");
//Set up default mongoose connection
const staffSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employmentId: String,
  next_of_kin: String,
  phone_number: String,
  next_of_kin_address: String,
  next_of_kin_phone_number: String,
  onAppointment: {
    default: false,
    type: Boolean,
  },
  // user_type: {
  //   type: String,
  //   default: "staff",
  // },
});

module.exports = mongoose.model("Staff", staffSchema);
