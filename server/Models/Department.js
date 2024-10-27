const mongoose = require('mongoose');
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    hodId: {
        type: Schema.Types.ObjectId,
        ref: 'Hod' // Reference to the Department model
    },
    date: {
        type: Date,
        default: Date.now  // Set default value to current date and time
    }
});

module.exports = mongoose.model("Department", DepartmentSchema);
