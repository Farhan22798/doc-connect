const { updateDoctorInfo, getDoctorShcedule, updateDoctorShcedule, getDoctorAppointments, updateDoctorAppointmentStatus, getDoctorAppointmentsHistory } = require("../controllers/doctor.controller")

const router=require("express").Router()

router 

.post("/update-dr-info",updateDoctorInfo)
.get("/get-shcedule",getDoctorShcedule)
.get("/get-appointments",getDoctorAppointments)
.get("/get-appointments-history",getDoctorAppointmentsHistory)
.put("/update-time/:did",updateDoctorShcedule)
.put("/updateAppStatus/:aid",updateDoctorAppointmentStatus)




module.exports=router