const Pharm = require("./../models/Pharmarcist");
const User = require("./../models/User");
const Appointment = require("./../models/Appointment")
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const Prescription = require("../models/Prescription");

function Signup(req, res, next) {
  Pharm.find({ email: req.body.email })
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
              user_type: "pharm",
              password: hash,
            })
              .save()
              .then((use) => {
                console.log("count: 2");
                const doc = new Pharm({
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

function getPrescriptions(req, res, next) {
  Prescription.find({prescription_fulfilled: false})
  .populate({
    path: "appointment",  
    populate: {
      path: "doctor",
      select: "first_name last_name"
    }
  })  
  .populate({
    path: "appointment", 
    populate: {
     path: "patient",
     select: "first_name last_name"
    }
  })
  .then((appoint) => {
      res.status(200).json({
        message:appoint
      })
  })
}
function fulfillPrescription(req, res, next){
  Prescription.findOne({_id: req.body.id})
  .then((appoint) => { 
    if (!appoint) {
      return res.status(404).json({ message: 'Prescription not found or already fulfilled' });
    }  
    appoint["prescription_fulfilled"] = true
    if(req.body.unavailable_medications){ 
      appoint["unavailable_medications"] = req.body.unavailable_medications
    }    
    return appoint.save()
  })
  .then(() => {
    res.status(200).json({ message: 'Prescription fufilled' })
  })
  .catch((err) => {   
    console.log(err)
    return res.status(500).json({err:err}) 
  })
}  
function unfulfillPrescription(req, res, next){
  Prescription.findOne({_id: req.params.id})
  .then((appoint) => { 
    appoint["prescription_fulfilled"] = false
    return appoint.save()
  })
  .then(() => {
    res.status(200).json({ message: 'Prescription fufilled' })
  })
  .catch((err) => {   
    console.log(err)
    return res.status(500).json({err:err}) 
  })
}  
function getSinglePrescription(req, res, next){
  Prescription.findOne({appointment: req.params.id})
  .then((presc) => {
    res.status(200).json(
      {message: presc}
    )
  })
}

function getCompletedPrescription(req, res, next) {
  Prescription.find({prescription_fulfilled: true})
  .populate({
    path: "appointment",  
    populate: {
      path: "doctor",
      select: "first_name last_name"
    }
  })  
  .populate({
    path: "appointment", 
    populate: {
     path: "patient",
     select: "first_name last_name"
    }
  })
  .then((appoint) => {
      res.status(200).json({
        message: appoint 
      })
  })
  .catch((err) => {
    console.log(err)
    return res.status(500).json({err:err})
  })
}

module.exports = {
  Signup,
  getPrescriptions,
  getCompletedPrescription,
  fulfillPrescription,
  unfulfillPrescription,
  getSinglePrescription
};
