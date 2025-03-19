const asyncHandler = require("express-async-handler")

const { doctorUpload } = require("../utils/upload")
const validator = require("validator")
const { checkEmpty } = require("../utils/checkEmpty")
const cloud = require("../utils/cloudinary")
const path = require("path")
const Doctor = require("../models/Doctor")
const Appointments = require("../models/Appointments")

exports.updateDoctorInfo = asyncHandler(async (req, res) => {
    doctorUpload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "multer error" })
        }
        //cloudinary here 
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "hero image is required" })
        }

        const { address, city} = req.body

        const { isError, error } = checkEmpty({ address, city })
        if (isError) {
            return res.status(400).json({ message: "all fileds required", error })
        }
        const image = {}
        for (const key in req.files) {
            const { secure_url } = await cloud.uploader.upload(req.files[key][0].path)
            image[key] = secure_url
        }



        console.log(req.user)
        console.log(req.body)
        console.log(req.files)

        await Doctor.findByIdAndUpdate(req.user, { ...req.body, ...image, infoComplete: true })
        res.json({ message: "info update" })
    })
})


exports.getDoctorShcedule = asyncHandler(async (req, res) => {
    const result = await Doctor.find({ _id: req.user })
    res.json({ message: "shcedule fetch success", result })
})

exports.updateDoctorSchedule = asyncHandler(async (req, res) => {
    const { did } = req.params;
    const { day, startTime, endTime } = req.body;


    const { isError, error } = checkEmpty({ day, startTime, endTime})
    if (isError) {
        return res.status(400).json({ message: "all fileds required", error })
    }

    const doctor = await Doctor.findById(did);
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.schedule[day] = { startTime, endTime };

    await doctor.save();
    res.json({ message: "Doctor schedule updated", schedule: doctor.schedule });
});






exports.getDoctorAppointments = asyncHandler(async (req, res) => {

    const result = await Appointments
        .find({ doctor: req.user, status: { $nin: ["Old","Cancelled"] } }).select(" -createdAt -updatedAt -__v")
        .populate("patient", "patientName gender mobile")
        .sort({ createdAt: -1 })
    res.json({ message: "appointments fetch success", result })
})
exports.getDoctorAppointmentsHistory = asyncHandler(async (req, res) => {

    const result = await Appointments
        .find({ doctor: req.user, status: { $nin: ["Pending","Confirmed"] } }).select(" -createdAt -updatedAt -__v")
        .populate("patient", "patientName gender mobile")
        .sort({ createdAt: -1 })
    res.json({ message: "appointments fetch success", result })
})

exports.updateDoctorAppointmentStatus = asyncHandler(async (req, res) => {
    const { aid } = req.params
    await Appointments.findByIdAndUpdate(aid, { status: req.body.status })
    res.json({ message: "appointment status update" })
})











