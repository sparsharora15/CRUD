const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    StudentName: {
        type: String,
        required: true
    },
    StudentEmail: {
        required: true,
        type: String
        
    },
    StudentNumber: {
        type: Number,
        required: true
    },
    password: {
        required: true,
        type: String
        
    },
    jwtToken:{
        type:String
    },

})
const Students = mongoose.model("Students",studentSchema)
module.exports = Students