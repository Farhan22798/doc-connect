const { getKaroProductsforPublicview, getPublicProductDetails, getDoctorsForPatients, getDocDetails, bookAppointment } = require("../controllers/patient.controller")

const router = require("express").Router()

router

.get("/getDrForPatients",getDoctorsForPatients)
.get("/getDrDetailsForPatients/:did",getDocDetails)
.post("/book",bookAppointment)



module.exports = router