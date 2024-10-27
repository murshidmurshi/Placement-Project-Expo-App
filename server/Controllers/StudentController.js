const express = require('express')
const env = require('dotenv').config()
const StudentSchema = require('../Models/Student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../Models/Student')
const RequestedJob = require('../Models/Requested')
const Hod = require('../Models/Hod')
const cloudinary = require('../utils/Cloudinary'); // Replace './cloudinaryConfig' with the correct path to your module


const Login = async (req, res) => {
    try {
        const { studentId, password } = req.body
        let student_details = await StudentSchema.findOne({ studentId });
        if (!student_details) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const passwordCompare = await bcrypt.compare(password, student_details.password)
        if (!passwordCompare) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const data = { id: student_details?.studentId }
        const authtoken = jwt.sign(data, process.env.JWT_Secret);
        const success = true;
        res.json({ success, authtoken })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const AllStudent = async (req, res) => {
    try {
        let student = await Student.find();
        // student = student.filter((student) => student.status == "active")
        const success = true;
        res.json({ success, student })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}


const CheckRole = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;
        console.log(token, 'token');
        // Decode the token to get the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, 123456);
        // Extract the user ID from the decoded payload
        const userId = decoded.id;
        console.log(userId, 'userIduserIduserIduserIduserId');
        const user = await Student.find({ studentId: userId });
        console.log(user, 'user');
        const hod = await Hod.findOne({ department: user[0]?.department });
        console.log(hod, 'hod');
        const success = true;
        res.json({ success, user, hod: hod });
    } catch (error) {

        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const SingleStudentUpdateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        let { status } = req.body; // Assuming these are the fields you want to update
        console.log(id, status, 'id');

        // Check if the student exists
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Update the student
        await Student.findByIdAndUpdate(id, { status: status }, { new: true });

        // Fetch the updated student
        const updatedStudent = await Student.findById(id);
        console.log(updatedStudent, 'updatedStudent');

        // Send response
        res.json({ success: true, message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Error!!!');
    }
}


const HodStudent = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id, 'id');
        let student = await Student.find({ departmentId: id });
        console.log(student, 'student');
        const success = true;

        res.json({ success, student })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}

// const EditStudent = async (req, res) => {
//     try {
//         let { name, studentId, password,newpassword,department, imageUri,  newPublicId } = req.body;
//         console.log(req.body,'req.body');

//         let student_details = await Student.findById(req.params.id)

//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(newpassword, salt);

//         console.log(student_details,'student_details');
//         let update = {}
//         if (imageUri) {
//             update.avtar = imageUri
//         }
//         if (newPublicId) {
//             update.public_id = newPublicId
//         }
//         if (name) {
//             update.name = name
//         }
//         if (studentId) {
//             update.studentId = studentId
//         }
//         if (department) {
//             update.department = department
//         }
//         if(newpassword){
//             update.password = secPass
//         }
//         else{
//             update.password = password
//         }
//       console.log(student_details.publicId ,newPublicId,123456789);
//         if (student_details.publicId) {
//             if (student_details.publicId !== newPublicId) {
//                 let Delete = await cloudinary.uploader.destroy(student_details.publicId)
//                 console.log(Delete, 'Deletee');
//             }
//         }
//         const UpdateAll = await Student.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
//         res.json({ success: true, UpdateAll })
//         console.log(UpdateAll,'UpdateAll');

//     }
//     catch (err) {
//         console.log(err);
//     }
// }


const EditStudent = async (req, res) => {
    try {
        let { name, studentId, password, newpassword, department, imageUri, newPublicId, resumeId, email, phone, address, resume, jobId, companyId, } = req.body;
        console.log(req.body, 'Rq...............');
        let student_details = await Student.findById(req.params.id);
        const salt = await bcrypt.genSalt(10);
        // const secPass = await bcrypt.hash(newpassword, salt);

        console.log(student_details, 'student_details');
        let update = {};


        // Hash the new password if provided
        
        if (newpassword) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(newpassword, salt);
            update.password = secPass;
            console.log( update.password , "update.password",secPass );
        }
        
        // Check if there's a change in studentId
        if (studentId) {
            // Generate authToken if there's a change in studentId
            const data = { id: studentId };
            const authtoken = jwt.sign(data, process.env.JWT_Secret);
            update.authtoken = authtoken;
        }

        // Update other fields if provided
        if (imageUri) {
            update.avtar = imageUri;
        }
        if (newPublicId) {
            update.publicId = newPublicId;
        }
        if (name) {
            update.name = name;
        }
        if (department) {
            update.department = department;
        }
        if (email) {
            update.email = email;
        }
        if (address) {
            update.address = address;
        }
        if (phone) {
            update.phone = phone;
        }
        // Conditional update for resume and public_id fields
        if (resume && resumeId) {
            update.resume = resume;
            update.resumeId = resumeId;
        }
        console.log(resumeId,newPublicId, 'resumeId');
        console.log(student_details?.resumeId,student_details.publicId, 'student_details.publicId');

        if (student_details.resumeId) {
            if (student_details.resumeId !== resumeId) {
                let Delete = await cloudinary.uploader.destroy(student_details.resumeId)
                console.log(Delete, 'Deletee');
            }
        }
        if (student_details.publicId) {
            if (student_details.publicId !== newPublicId) {
                let Delete = await cloudinary.uploader.destroy(student_details.publicId)
                console.log(Delete, 'Deletee');
            }
        }

        // Update the Student document
        const UpdateAll = await Student.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
        if (companyId && jobId) {
            let RequestedDetail = await RequestedJob.findOne({ jobId: jobId })
            if (RequestedDetail) {
                const success = false;
                console.log("Already exists");
                return res.json({ success, error: "This Company Id  already exist" })
            }
            else {
                const newRequest = new RequestedJob({ companyId, studentId: req.params.id, jobId: jobId, status: 'applied' });
                const savedRequest = await newRequest.save()
                console.log(savedRequest, 'savedRequest');
                const success = true;
                return res.json({ success, savedRequest, message: "Requested  successful" })
            }
        }
        // if(jobId){
        //     // let UpdatedJob=     await Job.updateOne({ _id: jobId }, { $push: { studenId: UpdateAll?._id } });
        //     const UpdatedJob = await Job.updateOne(
        //         { _id: jobId, studentsId: { $ne: UpdateAll?._id } }, // Check if student's ID is not already present
        //         { $push: { studentsId: UpdateAll?._id } }
        //     );
        //     console.log(UpdatedJob, '123456789');
        // }
        //    const UpdateAll = await Job.findByIdAndUpdate(jobId, { $set: update }, { new: true });
        // If there's a change in studentId, include authtoken in the response
        if (update.authtoken) {
            res.json({ success: true, authtoken: update.authtoken, UpdateAll });
        } else {
            res.json({ success: true, UpdateAll });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}


const AllRequest = async (req, res) => {
    try {
        let { jobId } = req.body;
        // Fetch all requests
        let allRequests;
        if (jobId) {
            allRequests = await RequestedJob.find({ jobId: jobId }).populate('studentId').populate('jobId').populate('companyId');
        } else {
            allRequests = await RequestedJob.find().populate('studentId').populate('jobId').populate('companyId');
        }
        
        // Filter requests based on their status
        let activeRequests = allRequests?.filter(request => request.status === 'active');
        let rejectRequests = allRequests?.filter(request => request.status === 'reject');
        let PendingRequest = allRequests?.filter(request => request.status === 'applied');
        // Return the filtered lists
        const success = true;
        res.json({ success, activeRequests, PendingRequest, rejectRequests });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}


const AllStudentRequest = async (req, res) => {
    try {
        let id= req.params.id;
    
        // Fetch all requests
        let allRequests;
            allRequests = await RequestedJob.find({studentId:id}).populate('studentId').populate('jobId').populate('companyId');

        // Filter requests based on their status
        let activeRequests = allRequests?.filter(request => request.status === 'active');
        let rejectRequests = allRequests?.filter(request => request.status === 'reject');
        let PendingRequest = allRequests?.filter(request => request.status === 'applied');
        // Return the filtered lists
        const success = true;
        res.json({ success, activeRequests, PendingRequest, rejectRequests });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const UpdateRequest = async (req, res) => {
    try {
        let id = req.params.id;
        let { status, studentId } = req.body;
        console.log(id, studentId, 'id');
        // Fetch the requested job by its ID
        let request = await RequestedJob.findOne({ jobId: id, studentId: studentId });
        console.log(request, 'request');
        if (!request) {
            return res.status(404).json({ success: false, error: "Requested job not found" });
        }
        // Update the status field
        request.status = status;
        // Save the updated document
        await request.save();
        console.log(request, 'Updated request');
        const success = true;
        res.json({ success, request });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: "Internal Error!!!" });
    }
}







module.exports = { Login, AllStudent, CheckRole, SingleStudentUpdateStatus, HodStudent, EditStudent, AllRequest, UpdateRequest,AllStudentRequest }