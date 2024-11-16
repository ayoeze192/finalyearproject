const Admin = require("../models/Admin");
const User = require("../models/User");
const Student = require("../models/Students");
const Staffs = require("../models/Staffs");
const bcrypt = require("bcrypt");
const Appointment = require("./../models/Appointment");

// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
function Signup(req, res, next) {
  Admin.find({ email: req.body.email })
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
              password: hash,
              user_type: "admin",
            })
              .save()
              .then((use) => {
                console.log("count: 2");
                const doc = new Admin({
                  _id: new mongoose.Types.ObjectId(),
                  user: use._id,
                  employmentId: req.body.employmentId,
                  picture: req.body.picture,
                });
                return doc.save();
              })
              .then(() => {
                res.status(201).json({
                  message: "Account Succesfully Created Created",
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

function CreateStudent(req, res, next) {
  User.find({ email: req.body.email })
    .then((response) => {
      if (!response) {
        res.status(409).json({
          message: "Student already exist",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_type: "student",
        });
        user
          .save()
          .then((saveduser) => {
            const student = new Student({
              _id: new mongoose.Types.ObjectId(),
              user: saveduser._id,
              matric_number: req.body.matric_number,
              faculty: req.body.faculty,
              deparment: req.body.deparment,
              next_of_kin: req.body.next_of_kin,
              phone_number: req.phone_number,
              next_of_kin_address: req.body.next_of_kin_address,
              next_of_kin_phone_number: req.body.next_of_kin_phone_number,
            });
            return student.save();
          })
          .then((response) => {
            res.status(201).json({
              message: "Student Account Succesfully Created",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteStudent(req, res, next) {
  Student.deleteOne({ _id: res.params.id })
    .then((response) => {
      res.status(200).json(
        {
          message: "Successfully Removed Student",
        }
      )
    })
    .catch((error) => {
      console.log(error);
    });
}

function CreateStaffs(req, res, next) {
  Staffs.find({ email: req.body.email })
    .then((response) => {
      if (!response) {
        res.status(409).json({
          message: "Student already exist",
        });
      } else {
        const user = new User({ 
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_type: "student",
        });
        user 
          .save()
          .then((saveduser) => { 
            const student = new Staffs({
              _id: new mongoose.Types.ObjectId(),
              user: saveduser._id,
              employmentId: req.body.employmentId,
              next_of_kin: req.body.next_of_kin,
              phone_number: req.body.phone_number,
              next_of_kin_address: req.body.next_of_kin_address,
              next_of_kin_phone_number: req.body.next_of_kin_phone_number,
            });
            return student.save();
          })
          .then((response) => {
            res.status(201).json({
              message: "Student Account Succesfully Created",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function getStudents(req, res, next) {
  Student.find()
    .populate("user", "first_name last_name matric_number email user_type")
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Successfull", result });
      }
    });
}
function getStaffs(req, res, next) {
  Staffs.find()
    .populate("user", "first_name last_name employment_id email")
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Successfull", result });
      }
    });
}

module.exports = {
  Signup,
  CreateStudent,
  CreateStaffs,
  getStudents,
  getStaffs,
  deleteStudent,
};
