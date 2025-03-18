const {  getDoctorsForPatients, getDocDetails, bookAppointment, getMyAppointments, getAppointmentHistory } = require("../controllers/patient.controller")

const router = require("express").Router()

router

.get("/getDrForPatients",getDoctorsForPatients)
.get("/getDrDetailsForPatients/:did",getDocDetails)
.post("/book",bookAppointment)
.get("/fetch-appointments", getMyAppointments)
.get("/fetch-appointments-history", getAppointmentHistory)



module.exports = router