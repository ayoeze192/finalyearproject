var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PharmarcistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employmentId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  // user_type: {
  //   type: String,
  //   default: "pharmacy",
  // },
});

module.exports = mongoose.model("Pharmarcist", PharmarcistSchema);
