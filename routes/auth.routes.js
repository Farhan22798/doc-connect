const { registerAdmin, loginAdmin, verifyAdminOTP, logoutAdmin, registerpatient, loginpatient, logoutpatient, registerDoctor, loginDoctor, logoutDoctor, registerPatient, loginPatient, logoutPatient } = require("../controllers/auth.controller")

const router = require("express").Router()

router

    .post("/register-admin", registerAdmin)
    .post("/register-doctor", registerDoctor)
    .post("/register-patient", registerPatient)
    .post("/login-admin", loginAdmin)
    .post("/login-doctor", loginDoctor)
    .post("/login-patient", loginPatient)
    .post("/verify-admin-otp", verifyAdminOTP)
    .post("/logout-admin", logoutAdmin)
    .post("/logout-doctor", logoutDoctor)
    .post("/logout-patient", logoutPatient)

module.exports = router 