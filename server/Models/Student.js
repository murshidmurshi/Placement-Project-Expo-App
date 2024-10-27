const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true // Assuming student IDs are unique
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    department: {
        type: String,
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department' // Reference to the Department model
    },
    publicId: {
        type: String,
    },
    resumeId: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    avtar: {
        type: String,
        required: false // Assuming image is optional
    },
    resume: {
        type: String,
        required: false // Assuming image is optional
    },
    status: {
        type: String,
        default: 'active',
    },
    date: {
        type: Date,
        default: Date.now  // Set default value to current date and time
    }
});
module.exports = mongoose.model("Student", StudentSchema);
