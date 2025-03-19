const {  getDoctorsForPatients, getDocDetails, bookAppointment, getMyAppointments, getAppointmentHistory, getSearchedDoctors } = require("../controllers/patient.controller")

const router = require("express").Router()

router

.get("/getDrForPatients",getDoctorsForPatients)
.get("/getDrDetailsForPatients/:did",getDocDetails)
.post("/book",bookAppointment)
.get("/fetch-appointments", getMyAppointments)
.get("/fetch-appointments-history", getAppointmentHistory)
.get("/fetch-search", getSearchedDoctors)



module.exports = router