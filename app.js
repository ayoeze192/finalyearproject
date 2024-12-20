const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const doctor = require("./routes/doctors");
const admin = require("./routes/admin");
const profile = require("./routes/profile");
const pharm = require("./routes/pharmarcist");
const appointment = require("./routes/Appointment");
const auth = require("./routes/auth");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://Ayoeze191:75739768jc@cluster0.ipkimb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure CORS to allow all origins and credentials
app.use(
  cors({
    origin: "http://localhost:3000",    // Allow all origins
    credentials: true,  // Allow credentials (cookies, authorization headers)
  })
);

// Routes
app.use("/doctors", doctor);
app.use("/admin", admin);
app.use("/profile", profile);
app.use("/appointments", appointment);
app.use("/auth", auth);
app.use("/pharm", pharm);

// Error handling middleware
app.use((res, req, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
