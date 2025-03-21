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




// exports.bookAppointment = asyncHandler(async (req, res) => {
//     const { doctor, customerdetsreseaons } = req.body
//     await Appointments.create({ doctor, customerdetsreseaons, patient: req.user })
//     res.json({ message: "appointment placed" })
// })

exports.getMyAppointments = asyncHandler(async (req, res) => {

    const result = await Appointments
        .find({ patient: req.user, status: { $nin: ["Cancelled","Old"] } }).select("-patient -createdAt -updatedAt -__v")
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



// Function to generate time slots
const generateTimeSlots = (startTime, endTime, bookedSlots) => {
    const slots = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
        let endSlotHour = startHour;
        let endSlotMinute = startMinute + 30;
        if (endSlotMinute >= 60) {
            endSlotMinute -= 60;
            endSlotHour += 1;
        }

        const slotTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")} - ${endSlotHour.toString().padStart(2, "0")}:${endSlotMinute.toString().padStart(2, "0")}`;
        slots.push({
            time: slotTime,
            booked: bookedSlots.includes(slotTime),
        });

        startHour = endSlotHour;
        startMinute = endSlotMinute;
    }

    return slots;
};

// Fetch available slots for a doctor on a given date
exports.getDoctorSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        const schedule = doctor.schedule[dayOfWeek];

        if (!schedule) {
            return res.json({ message: "Doctor is unavailable on this day" });
        }

        // Get already booked slots
        const appointments = await Appointment.find({ doctor: doctorId, "customerdetsreseaons.date": date });
        const bookedSlots = appointments.map(appointment => appointment.customerdetsreseaons.map(d => d.time)).flat();

        const availableSlots = generateTimeSlots(schedule.startTime, schedule.endTime, bookedSlots);

        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { patient, doctor, date, time, reason } = req.body;

        const existingAppointment = await Appointment.findOne({ doctor, "customerdetsreseaons.date": date, "customerdetsreseaons.time": time });
        if (existingAppointment) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        const newAppointment = new Appointment({
            patient,
            doctor,
            customerdetsreseaons: [{ date, time, reason }],
            status: "Pending",
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error booking appointment", error });
    }
};




