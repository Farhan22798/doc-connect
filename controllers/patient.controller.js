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
    const result = await Doctor.findById(req.params.did).select((" -createdAt -updatedAt -__v"))
    res.json({ message: "doctor details fetch success", result })
}




exports.bookAppointment = asyncHandler(async (req, res) => {
    const { doctor, customerdetsreseaons } = req.body
    await Appointments.create({ doctor, customerdetsreseaons, patient: req.user })
    res.json({ message: "appointment placed" })
})

exports.getMyAppointments = asyncHandler(async (req, res) => {

    const result = await Appointments
        .find({ patient: req.user, status: { $ne: "Old" } }).select("-patient -createdAt -updatedAt -__v")
        .populate("doctor", "doctorName hero")
        .sort({ createdAt: -1 })
    res.json({ message: "appointment fetch success", result })
})

exports.getAppointmentHistory = asyncHandler(async (req, res) => {

    const result = await Appointments
        .find({ patient: req.user, status: { $nin: ["Pending", "Confirmed"] } }).select(" -createdAt -updatedAt -__v")
        .populate("doctor", "doctorName hero")
        .sort({ createdAt: -1 })
    res.json({ message: "appointment history fetch success", result })
})

exports.getSearchedDoctors = asyncHandler(async (req, res) => {
    const { searched } = req.query;  // 🔥 Use `req.query` for GET requests

    if (!searched) {
        return res.status(400).json({ message: "Search term is required" });
    }

    const result = await Doctor.find({
        isActive: true,
        $or: [
            { doctorName: { $regex: searched, $options: "i" } },
            { address: { $regex: searched, $options: "i" } },
            { spec: { $regex: searched, $options: "i" } },
            { city: { $regex: searched, $options: "i" } }
        ]
    }).select("-createdAt -updatedAt -__v")
    .sort({ createdAt: -1 });

    res.json({ message: "Search results fetched successfully", result });
});



