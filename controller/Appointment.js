const Appointment = require("./../models/Appointment");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Doctors = require("../models/Doctors");
const User = require("../models/User");
const Students = require("../models/Students");
const Prescription = require("../models/Prescription");

async function getStudentId (userId){
  const user = await Students.findOne({user: userId})
  // console.log(user._id.toString())
  return user._id
}
// manage subscriptions
// profile manage Subscription
function getDoctorsAppoints(req, res) { 
  Appointment
    .find
    // 
    ({ doctor: req.userData.userId })
    .populate("patient", "first_name last_name _id")
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
      console.log(err);
      res.status(401).json({
        err: err,
      });
    });
}

async function setOnAppointment (user_type, id) {
  console.log(user_type)
  if(user_type == "student"){
    const student = await Students.findOne({user: id})
    student["onAppointment"] = false
    student.save()
  }
}

function getDoctorpendingAppointments(req, res) {
  Appointment.find({ completed: false,
     doctor: req.userData.userId
     }
    )
    .populate("patient", "first_name last_name _id user_type")
    .then(async (appointment) => {
      // console.log(result)
      if (appointment) {
        const result = await Promise.all(
          appointment.map(async (resu) => {
              if (resu) {
                  const val = { ...resu._doc, student_id: await getStudentId(resu.patient._id) };
                  return val;
              }
          })
      ); 
        res.status(200).json({ 
          result 
        })
      } else {
        res.status(404).json({
          message: "Not Found", 
        }); 
      } 
    });
}

function getDoctorcompletedAppointments(req, res) {
  Appointment.find({ completed: true, doctor: req.userData.userId })
    .populate("patient", "first_name last_name _id")
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
    });
}
function getPatientCompletedAppointments(req, res, next){
  Appointment.find({completed: true, patient: req.params.id})
  .then((result) => {
    res.status(200).json({result })
    console.log(res)
  })
}

function getSingleAppointment(req, res) {
  Appointment.findById(req.params.id)
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
function deleteAppointment(req, res){
   Appointment.deleteOne({_id: req.params.id})
    .then((result) => {
      res.status(200).json({
        message: "Succesfully Deleted",
      });
    })
    .catch((err) => {
      res.status(404).json({
        err,
      });
    });
}

async function  SearchforAppointment(req, res) {
  try {
    const { doctor, patient, startTime, endTime, completed } = req.query;

    // Build the search criteria dynamically based on the input
    let searchCriteria = {};

    if (doctor) {
      searchCriteria.doctor = mongoose.Types.ObjectId(doctor);
    }
    if (patient) {
      searchCriteria.patient = mongoose.Types.ObjectId(patient);
    }
    if (startTime) {
      searchCriteria.startTime = { $gte: new Date(startTime) };
    }
    if (endTime) {
      searchCriteria.endTime = { $lte: new Date(endTime) };
    }
    if (completed !== undefined) {
      searchCriteria.completed = completed === "true";
    }

    const appointments = await Appointment.find(searchCriteria)
      .populate("doctor", "first_name last_name email") // Populate doctor details
      .populate("patient", "first_name last_name email"); // Populate patient details

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error searching appointments:", error);
    res.status(500).json({ message: "Server error occurred while searching appointments." });
  }
}

function BookAppointment(req, res) {
  const appointment = {
    _id: new mongoose.Types.ObjectId(),
    doctor: req.body.doctor,
    patient: req.body.patient,
    startTime: dayjs(),
    endTime: dayjs().add(10, "minutes"),
    temperature: req.body.temperature,
    diastolic_pressure: req.body.diastolic_pressure,
    systolic_pressure: req.body.systolic_pressure,
    observation: req.body.observation
  };
  Appointment.findOne({
    doctor: req.body.doctor,
    patient: req.body.patient,
    completed: false,
    filled: false,
  })
    .then((appoint) => {
      if (appoint !== null) { 
        res.status(409).json({ message: "Tere is an appointment before" });
      } else {
        const saveappointment = new Appointment({ ...appointment });
        return saveappointment.save();  
      }
    })
    .then((result) => {
      Students.findOneAndUpdate(
        { user: req.body.patient },
        { $set: { onAppointment: true } }
      ).then(() => {
        res.status(200).json({
          message: "Successful",
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
}

function UnBookAppointment(req, res) {
  console.log(req.body)
  Appointment.deleteOne({
    patient: req.body.patient,
    completed: false,
    filled: false,
  })
    .then((appoint) => {
      setOnAppointment(req.body.patient_type, req.body.patient)
      res.status(200).json({message: "Successfull"})
    })
    .catch((error) => { 
      console.log(error); 
      res.status(500).json({
        error,
      });
    });
}

function CompleteAppointment(req, res) {
  // console.log({ doctor: req.body.doctor, patient: req.body.patient })
  Appointment.findOneAndUpdate(
    {
      doctor: req.body.doctor,
      patient: req.body.patient,
      completed: false,
    },
    { $set: { completed: true } }
  )
    .then( (appoint) => {
      appoint.completed = true;
      
      return Students.findOne();
    })
    .then(async(stud) => {
      await setOnAppointment(req.body.patient_type, req.body.patient)
      res.status(200).json({
        message: "Successfull",
      });
    })
    .catch((err) => {
      console.log(err); 
    }); 
} 

function prescribeDrugs(req, res) {
  // console.log(req.body)
  Prescription.findOne({appointment: req.body.appointment})
  .then((presc) => {
    if(!presc){
      const prescription = new Prescription({
        _id: new mongoose.Types.ObjectId(),
        appointment: req.body.appointment,
        drugs: req.body.drugs,
        prescription_fulfilled: false
      })
      return prescription.save()
    }
    else{
      presc["drugs"] = req.body.drugs
      return presc.save()
    }
  })
  .then((result) => {
    // console.log(result)
    res.status(200).json({message: "Successfull"})
  })
  .catch((err) => { 
    console.log(err)
    res.status(500).json({err: err})
  }) 
} 

module.exports = {
  getSingleAppointment,
  deleteAppointment,
  BookAppointment,
  getDoctorsAppoints,
  CompleteAppointment,
  getDoctorpendingAppointments,
  getDoctorcompletedAppointments,
  prescribeDrugs,
  UnBookAppointment,
  getPatientCompletedAppointments,
  SearchforAppointment
};
