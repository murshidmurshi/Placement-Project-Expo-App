const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
    name: {
        type: String,
        // required: true
    },
    companyId: {
        type: String,
        required: true,
        unique: true // Assuming Company IDs are unique
    },
    publicId: {
        type: String,
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
    password: {
        type: String,
        required: true
    },
    avtar: {
        type: String,
        required: false // Assuming image is optional
    },
    location: {
        type: String,
        required: false 
    },
    desc: {
        type: String,
        required: false 
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'], // Define allowed values for status
        default: 'pending' // Set default value to 'pending'
    },

    date: {
        type: Date,
        default: Date.now  // Set default value to current date and time
    }
});

module.exports = mongoose.model("Company", CompanySchema);
