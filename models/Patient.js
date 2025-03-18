const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"],  },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },

}, { timestamps: true })

module.exports = mongoose.model("patient", patientSchema)    