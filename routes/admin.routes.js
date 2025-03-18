const { getProductsForAdmin, approveAd, updatepatientAccount, getpatientsForAdmin, updateDoctorAccount, updatePatientAccount, getPatientsForAdmin, getDoctorsForAdmin } = require("../controllers/admin.controller")

const router = require("express").Router()

router
    .put("/doctor/update/:did", updateDoctorAccount)
    .put("/patient/update/:pid", updatePatientAccount)
    .get("/patientsForAdmin", getPatientsForAdmin)
    .get("/doctorsForAdmin", getDoctorsForAdmin)

module.exports = router