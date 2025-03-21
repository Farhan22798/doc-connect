const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Types.ObjectId, ref: "patient", required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: "doctor", required: true },
    customerdetsreseaons: [
        {
            date: { type: String, required: true },
            time: { type: String, required: true },
            reason: { type: String, required: true },
        }
    ],
    status: { type: String, default: "Pending", enum: ["Pending","Cancelled", "Confirmed", "Old"] },


}, { timestamps: true })

module.exports = mongoose.model("appointment", appointmentSchema)