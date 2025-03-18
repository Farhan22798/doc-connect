const multer = require("multer")

const storage = multer.diskStorage({
    filename: (req, file, cb) => { cb(null, file.originalname) },
    //destination:()=>{}
})

const doctorUpload = multer({ storage }).fields([
    { name: "certificate", maxCount: 1 },
    { name: "hero", maxCount: 1 },
])



module.exports = {
    doctorUpload,
   
}