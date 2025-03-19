const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Patient = require("../models/Patient")
const Doctor = require("../models/Doctor")



exports.doctorProtected = asyncHandler(async (req, res, next) => {
    const token = req.cookies["doctor"]
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, async(err, decode) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        const result = await Doctor.findById(decode._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "Account is blocked by Admin" })
        }


        req.user = decode._id
        next()
    })
})

exports.adminProtected = asyncHandler(async (req, res, next) => {
    const token = req.cookies["admin"]
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        req.user = decode._id
        next()
    })
})
exports.patientProtected = asyncHandler(async (req, res, next) => {
    const token = req.cookies["patient"]
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY,async (err, decode) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        const result = await Patient.findById(decode._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "Account is blocked by Admin" })
        }
        req.user = decode._id
        next()
    })
})

