const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function Login(req, res) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        
        if (err) { 
          return res.status(500).json({
            message: "Incorrect password",
          });
        }
        if (result == true) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "10000h",
            }
          );
          return res.status(200).json({
            message: "Auth Succesfull",
            result: {
              token: token,
              user_type: user.user_type,
              first_name: user.first_name,
              last_name: user.last_name,
              id: user._id, 
            },
          }); 
        }
        return res.status(401).json({ message: "Incorrect password" });
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: "Internal server error" }); // Generic error for security
    });
}
 

function EditProfile(req, res) {
  Doctor.findOne({ email: req.body.email })
    .then((doc) => {
      doc.first_name = req.body.first_name;
      doc.last_name = req.body.last_name; 
      doc.picture = req.body.picture;
      doc.address = req.body.address; 
      return doc.save();
    })
    .then((result) => {
      return res.status(200).json({
        message: "Succesfully updated your profile",
      });
    });
}

module.exports = {
  Login,
  EditProfile,
};
