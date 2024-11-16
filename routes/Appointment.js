const express = require("express");
const router = express.Router();
const appointment = require("./../controller/Appointment");
const multer = require("multer");
const useAuth = require("./../middleware/check-auth")
// get Requests
router.get("/", appointment.getDoctorsAppoints);
router.get("/completed", useAuth,appointment.getDoctorcompletedAppointments);
router.get("/pending", useAuth,appointment.getDoctorpendingAppointments);
router.get("/:id", appointment.getSingleAppointment);
router.get("/patient-previous-appointments/:id", appointment.getPatientCompletedAppointments)
// post Requests
router.post("/", useAuth,appointment.BookAppointment);
router.post("/prescribe", useAuth, appointment.prescribeDrugs);
router.post("/completed", useAuth,appointment.CompleteAppointment);
router.post("/unschedule", useAuth,appointment.UnBookAppointment);
// Delete Requests 
router.delete("/:id", useAuth, appointment.deleteAppointment)
module.exports = router;
 