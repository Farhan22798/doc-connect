const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const {  doctorProtected, adminProtected, patientProtected } = require("./midllewares/protected")
const app = express()


app.use(express.json()) // req.body
app.use(cookieParser()) // req.cookies
app.use(cors({
    origin: true,
    credentials: true // cookie
}))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/doctor", doctorProtected, require("./routes/doctor.routes"))
app.use("/api/admin", adminProtected, require("./routes/admin.routes"))
app.use("/api/patient", patientProtected, require("./routes/patient.routes"))
app.use("*", (req, res) => {
     res.status(404).json({ message: "resource not found" })
})


mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("db connected")
    app.listen(process.env.PORT || 5000, console.log("server running"))
})
