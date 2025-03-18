const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    doctorName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"],  },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    spec: { type: String, required: true },
    isActive: { type: Boolean, default: false },

    address: { type: String },
    city: { type: String },
    certificate: { type: String },
    hero: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    infoComplete: { type: Boolean, default: false },

}, { timestamps: true })

module.exports = mongoose.model("doctor", doctorSchema)    