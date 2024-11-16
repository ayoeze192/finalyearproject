const Staffs = require("./../models/Staffs");
const Staff = require("./../models/Staffs");
const Student = require("./../models/Students");
const User = require("./../models/User");

function getUserProfile(req, res, next) {
  let userModel = {};
  User.findOne({ _id: req.params.id }) 
    .then((result) => {
      if (result) { 
        userModel = { ...result._doc };
        if (result.user_type == "student") {
          return Student.findOne({ user: req.params.id });
        } else if (result.user_type == "staff") {
          return Staffs.findOne({ user: req.params.id });
        }
      } else {
        throw new Error("User not found");
      }
    })
    .then((user) => {
      if (user) {
        res.status(200).json({ result: { ...user._doc, ...userModel } }); // Spread both documents
      } else {
        res.status(404).json({ error: "User type details not found" });
      }
    });
}

function editUserProfile(req, res, next){
  User.findOne({ _id: req.params.id })
  .then((result) => {
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const userModel = { ...result._doc };

    if (result.user_type === "student") {
      return Student.findOneAndUpdate(
        { user: req.params.id },
        { ...req.body },
        { new: true }
      );
    } else if (result.user_type === "staff") {
      return Staffs.findOneAndUpdate(
        { user: req.params.id },
        { ...req.body },
        { new: true }
      );
    } else {
      throw new Error("Invalid user type");
    }
  })
  .then((updatedUser) => {
    if (updatedUser) {
      return res.status(200).json({
        message: "Successfully updated",
        updatedUser,
      });
    }
  })
  .catch((error) => {
    res.status(500).json({ message: error.message });
  });
}

module.exports = {
  getUserProfile,
  editUserProfile
};
