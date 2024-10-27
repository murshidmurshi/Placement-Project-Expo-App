const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequestedJob = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company' // Reference to the Department model
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job' // Reference to the Department model
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student' // Reference to the Department model
    },
    status:{
        type: String,
        default: 'pending'
    }
});

module.exports = mongoose.model("Requested", RequestedJob);
