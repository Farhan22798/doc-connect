const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const { generateOTP } = require("../utils/otp")
const { sendEmail } = require("../utils/email")
const jwt = require("jsonwebtoken")
const { differenceInSeconds } = require("date-fns")
const Admin = require("../models/Admin")
const Doctor = require("../models/Doctor")
const Patient = require("../models/Patient")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, mobile } = req.body
    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(mobile)) {
        return res.status(400).json({ message: "all fields required" })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "invalid email" })

    }

    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "invalid mobile" })

    }

    await Admin.create({ name, email, mobile })
    res.json({ message: "admin register succes" })

})

exports.loginAdmin = asyncHandler(async (req, res) => {
    const { username } = req.body

    const result = await Admin.findOne({ $or: [{ email: username }, { mobile: username }] })

    if (!result) {
        return res.status(400).json({ message: "invalid credentials" })
    }

    //send OTP 
    const otp = generateOTP()

    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: Date.now() })


    await sendEmail({
        message: `<h1>Your OTP is ${otp}</h1>`,
        subject: "verify otp to login",
        to: result.email
    })

    res.json({ message: "otp sent" })

})

exports.verifyAdminOTP = asyncHandler(async (req, res) => {
    const { otp, username } = req.body
    const result = await Admin.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "invalid credentials" })
    }
    if (result.otp !== otp) {
        return res.status(401).json({ message: "invalid otp" })
    }

    if (differenceInSeconds(Date.now(), result.otpSendOn) > process.env.OTP_EXPIRE) {
        await Admin.findByIdAndUpdate(result._id, { otp: null })
        return res.status(401).json({ message: " otp expired" })

    }

    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    res.cookie("admin", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "login success", result: {
            name: result.name,
            email: result.email
        }
    })
})

exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "logout success" })
})






exports.registerDoctor = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const isFound = await Doctor.findOne({ email }) // object
    if (isFound) {
        return res.status(409).json({ message: "email already exist, please use another email" })
    }
    const hash = await bcrypt.hash(password, 10)

    await Doctor.create({ ...req.body, password: hash })
    res.status(201).json({ message: "doctor register success", result: req.body })


})

exports.loginDoctor = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await Doctor.findOne({ email }) // object
    if (!result) {
        return res.status(409).json({ message: "email does not exist, please regsiter" })
    }
    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials pwd" })

    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    res.cookie("doctor", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"

    })

    res.json({
        message: "doctor login success", result: {
            _id: result._id,
            doctorName: result.doctorName,
            email: result.email,
            infoComplete: result.infoComplete,
            hero: result.hero ? result.hero : "",
            endTime: result.endTime ? result.endTime : "",
            startTime: result.startTime ? result.startTime : ""

        }
    })

})

exports.logoutDoctor = asyncHandler(async (req, res) => {
    res.clearCookie("doctor")
    res.json({ message: "doctor logout success" })
})


exports.registerPatient = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const isFound = await Patient.findOne({ email }) // object
    if (isFound) {
        return res.status(409).json({ message: "email already exist, please use another email" })
    }
    const hash = await bcrypt.hash(password, 10)

    await Patient.create({ ...req.body, password: hash })
    res.status(201).json({ message: "Patient register success", result: req.body })


})

exports.loginPatient = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await Patient.findOne({ email }) // object
    if (!result) {
        return res.status(409).json({ message: "email does not exist, please regsiter" })
    }
    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(401).json({ message: "invalid credentials pwd" })

    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    res.cookie("patient", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"

    })

    res.json({
        message: "Patient login success", result: {
            _id: result._id,
            patientName: result.patientName,
            email: result.email
        }
    })

})

exports.logoutPatient = asyncHandler(async (req, res) => {
    res.clearCookie("patient")
    res.json({ message: "patient logout success" })
})

