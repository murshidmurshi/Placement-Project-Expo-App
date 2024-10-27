const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company' // Reference to the Department model
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    qualification: {
        type: [String], // Changed to array of strings
        required: true
      },
    desc: {
        type: String,
        required: false
    },
    experience: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false
    },
    status:{
        type: String,
        default: 'pending'
    }
    // studentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]

});

module.exports = mongoose.model("Job", jobSchema);
