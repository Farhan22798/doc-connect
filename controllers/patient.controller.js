const Appointments = require("../models/Appointments")
const Doctor = require("../models/Doctor")
const asyncHandler = require("express-async-handler")




exports.getDoctorsForPatients = asyncHandler(async (req, res) => {
    const result = await Doctor
        .find({ isActive: true })
        .select(" -createdAt -updatedAt -__v ")
        .sort({ createdAt: -1 })
    res.json({ message: "doctor fetch success", result })
})

exports.getDocDetails = async (req, res) => {
    const { did } = req.params
    const result = await Doctor.findById(did)
    res.json({ message: "details fetch success", result })
}

exports.bookAppointment = asyncHandler(async (req, res) => {
    const { doctor } = req.body
        await Appointments.create({ doctor, patient: req.user })
    res.json({ message: "appointment placed" })
})
