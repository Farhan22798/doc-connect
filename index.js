const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); 

const { doctorProtected, adminProtected, patientProtected } = require("./midllewares/protected");

const app = express();

app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
    origin: true,
    credentials: true 
}));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/doctor", doctorProtected, require("./routes/doctor.routes"));
app.use("/api/admin", adminProtected, require("./routes/admin.routes"));
app.use("/api/patient", patientProtected, require("./routes/patient.routes"));

const frontendPath = path.join(__dirname, "dist"); // Point to dist folder
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
    console.log("DB Connected");
    app.listen(process.env.PORT || 5000, console.log("Server Running"));
});
