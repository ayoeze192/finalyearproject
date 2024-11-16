const Doctor = require("./../models/Doctors");
const User = require("./../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

function getDoctors(req, res, next) {
  Doctor.find()
    .populate("user", "first_name last_name")
    .then((result) => {
      if (result) {
        res.status(200).json({
          result,
        });
      } else {
        res.status(404).json({
          message: "Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(401).json({
        err: err,
      });
    });
}

function getSingleDoctor(req, res, next) {
  Doctor.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        docs: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        err,
      });
    });
}

function Signup(req, res, next) {
  console.log("count: 2");
  Doctor.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "Email Already Exist",
        });  
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              err: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              user_type: "doctor",
              password: hash,
            })
              .save()
              .then((use) => {
                console.log("count: 2");
                const doc = new Doctor({
                  _id: new mongoose.Types.ObjectId(),
                  user: use._id,
                  email: req.body.email,
                  password: hash,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  employmentId: req.body.employmentId,
                  picture: req.body.picture,
                });
                return doc.save();
              })
              .then(() => {
                res.status(201).json({
                  message: "Account Succesfully Created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
}

module.exports = {
  Signup,
  getSingleDoctor,
  getDoctors,
};
