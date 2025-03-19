// const mongoose = require("mongoose")

// const doctorSchema = new mongoose.Schema({
//     doctorName: { type: String, required: true },
//     gender: { type: String, enum: ["male", "female"],  },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//     spec: { type: String, required: true },
//     isActive: { type: Boolean, default: false },
//     address: { type: String },
//     city: { type: String },
//     certificate: { type: String },
//     hero: { type: String },
//     startTime: { type: String },
//     endTime: { type: String },
//     infoComplete: { type: Boolean, default: false },

// }, { timestamps: true })

// module.exports = mongoose.model("doctor", doctorSchema)    

const mongoose = require("mongoose");


const dailyScheduleSchema = new mongoose.Schema({

  startTime: { type: String,required:true },
  endTime: { type: String ,required:true},

}, { _id: false });

const doctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"] },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  spec: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  address: { type: String },
  city: { type: String },
  certificate: { type: String },
  hero: { type: String },
  infoComplete: { type: Boolean, default: false },
    schedule: {
    monday: dailyScheduleSchema,
    tuesday: dailyScheduleSchema,
    wednesday: dailyScheduleSchema,
    thursday: dailyScheduleSchema,
    friday: dailyScheduleSchema,
    saturday: dailyScheduleSchema,
    sunday: dailyScheduleSchema
  },
  

  
}, { timestamps: true });

module.exports = mongoose.model("doctor", doctorSchema);