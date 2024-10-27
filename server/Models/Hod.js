const mongoose = require('mongoose');
const { Schema } = mongoose;

const HodSchema = new Schema({
    name: {
        type: String,
        required: true
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
    hodId: {
        type: String,
        required: true,
        unique: true // Assuming HOD IDs are unique
    },
    publicId: {
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
    password: {
        type: String,
        required: true
    },
    avtar: {
        type: String,
        required: false // Assuming image is optional
    },
    date: {
        type: Date,
        default: Date.now  // Set default value to current date and time
    }
});

module.exports = mongoose.model("Hod", HodSchema);
