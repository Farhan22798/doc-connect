const asyncHandler = require("express-async-handler")
const Patient = require("../models/Patient")
const Doctor = require("../models/Doctor")


exports.updateDoctorAccount = asyncHandler(async (req, res) => {
    const { did } = req.params
    await Doctor.findByIdAndUpdate(did, { isActive: req.body.isActive })
    res.json({ message: "doctor account update" })
})
exports.updatePatientAccount = asyncHandler(async (req, res) => {
    const { pid } = req.params
    await Patient.findByIdAndUpdate(pid, { isActive: req.body.isActive })
    res.json({ message: "patient account update" })
    })



exports.getDoctorsForAdmin = asyncHandler(async (req, res) => {
    const result = await Doctor
        .find(req.body)
        .select(" -createdAt -updatedAt -__v ")
        .sort({ createdAt: -1 })
    res.json({ message: "doctor fetch success", result })
})
exports.getPatientsForAdmin = asyncHandler(async (req, res) => {
    const result = await Patient
        .find(req.body)
        .select(" -createdAt -updatedAt -__v ")
        .sort({ createdAt: -1 })
        .populate("_id", "patientName") 

    res.json({ message: "patient fetch success", result })
})