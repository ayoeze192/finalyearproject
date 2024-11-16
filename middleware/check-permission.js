function isDoctor(req, res, next) {
  if (req.userData.userType == "doctor") {
    next();
  } else {
    res.status(403).json({
      message: "Permission not allowed",
    });
  }
}

function isAdmin(req, res, next) {
  if (req.userData.userType == "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Permission not allowed",
    });
  }
}
function isPharm(req, res, next) {
  if (req.userData.userType == "pharm") {
    next();
  } else {
    res.status(403).json({
      message: "Permission not allowed",
    });
  }
}

module.exports = {
  isDoctor,
  isAdmin,
  isPharm
};
