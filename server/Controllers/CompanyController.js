const express = require('express')
const env = require('dotenv').config()
const AdminSchema = require('../Models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Hod = require('../Models/Hod')
const Department = require('../Models/Department')
const Student = require('../Models/Student')
const Admin = require('../Models/Admin')
const Company = require('../Models/Company')
const Job = require('../Models/Job')
const Requested = require('../Models/Requested')
const cloudinary = require('../utils/Cloudinary'); // Replace './cloudinaryConfig' with the correct path to your module


const Register = async (req, res) => {
    try {
        const { companyId, password, name } = req.body;
        console.log(req.body);
        let comapany_details = await Company.findOne({ companyId })
        if (comapany_details) {
            const success = false;
            return res.json({ success, error: "This Company Id  already exist" })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);

            const newCompany = new Company({ password: secPass, companyId, name });

            const savedCompany = await newCompany.save()

            const success = true;
            return res.json({ success, savedCompany, message: "Registration successful" })
        }
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Error!!!")
    }
}

const Login = async (req, res) => {
    try {
        const { companyId, password } = req.body

        let comapany_details = await Company.findOne({ companyId });
        console.log(comapany_details, 'comapany_details');
        if (!comapany_details) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const passwordCompare = await bcrypt.compare(password, comapany_details.password)

        if (!passwordCompare) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        else if (comapany_details?.status == "pending") {
            const success = false;
            return res.json({ success, error: "Admin have to approve your request" })
        }else if (comapany_details?.status == "reject") {
            const success = false;
            return res.json({ success, error: "Admin rejected your request" })
        } 
        
        else {
            const data = { id: comapany_details.companyId }
            const authtoken = jwt.sign(data, process.env.JWT_SECRET);
            const success = true;
            res.json({ success, authtoken, message: 'Successfull' })
        }

    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}


const AddCompany = async (req, res) => {
    try {
        const { name, companyId, password, logo, location, desc } = req.body;
        console.log(req.body, 'req.body');

        // Check if the company with the provided companyId already exists
        let company = await Company.findOne({ companyId });
        if (company) {
            return res.json({ success: false, error: "Company ID already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new Company instance
        const newCompany = new Company({
            name,
            companyId,
            password: hashedPassword,
            logo,
            location, desc
        });

        // Save the new company to the database
        const savedCompany = await newCompany.save();
        console.log(savedCompany, 'savedCompany');
        // Return success response
        return res.json({ success: true, company: savedCompany });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const AddJob = async (req, res) => {
    try {
        const { companyName, companyId, jobTitle, location, jobType, salary, qualification, experience, desc, logo } = req.body;
        console.log(req.body, ' req.body');

        // Check if the job with the provided company name and job title already exists
        let job = await Job.findOne({ companyName, jobTitle, companyId });
        if (job) {
            return res.json({ success: false, error: "Job already exists" });
        }

        // Create a new Job instance
        const newJob = new Job({
            companyId,
            companyName,
            jobTitle,
            location,
            jobType,
            salary, qualification,
            experience,
            desc,
            logo

        });

        // Save the new job to the database
        const savedJob = await newJob.save();
        console.log(savedJob, 'savedJob');

        // Return success response
        return res.json({ success: true, job: savedJob });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const AllCompany = async (req, res) => {
    try {
        let company = await Company.find();
        // let company= company?.filter(company => company.status === 'active');
        let activeCompany= company?.filter(company => company.status === 'active');
        let rejectCompany =  company?.filter(company => company.status === 'reject');
        let PendingCompany =  company?.filter(company => company.status === 'pending');
        const success = true;
        res.json({ success, company, activeCompany,rejectCompany,PendingCompany})
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}
const CompanyJob = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id,'id');
        const job = await Job.find({ companyId: id });
        let activeJob= job?.filter(job => job.status === 'active');
        const success = true;
        res.json({ success, job,activeJob })
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
        const companyId = decoded.id;
        const user = await Company.find({ companyId: companyId });
        console.log(user, 'user');
        const success = true;
        res.json({ success, user });
    } catch (error) {

        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const SingleJob = async (req, res) => {
    try {
        let id = req.params.id;
        let { studentId,CompanyParentId } = req.body;

        console.log(id, 'id123');
        let checkRequested = await Requested.find({ jobId: id, studentId })
        let job = await Job.findById(id);
        let company = await Company.findById(CompanyParentId);
        console.log(company,'Company');
        // if (checkRequested[0]?.status=="pending") {
        //     const success = true;
        //     console.log(checkRequested, 'checkRequested Become True');
        //     res.json({ success, job, pending:true })
        // } 
         if (checkRequested[0]?.status=="applied") {
            const success = true;
            console.log(checkRequested, 'checkRequested Become True');
            res.json({ success, job, applied:true,company })
        } 

       else if (checkRequested[0]?.status=="active") {
            const success = true;
            console.log(checkRequested, 'checkRequested Become True');
            res.json({ success, job, active:true,company })
        } 
       else if (checkRequested[0]?.status=="reject") {
            const success = true;
            console.log(checkRequested, 'checkRequested Become True');
            res.json({ success, job, reject:true,company })
        } 

        else {
            const success = true;
            console.log(checkRequested, 'checkRequested');
            res.json({ success, job,company  })
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const EditJob = async (req, res) => {
    try {
        const { jobTitle, location, jobType, salary, qualification, experience, desc, logo, status } = req.body;
        let id = req.params.id;
        console.log(id, 'id');
        console.log(req.body, 'req.body');
        // Find the job in the database based on its unique identifier (_id)
        let job = await Job.findById(id);
        if (!job) {
            return res.json({ success: false, error: "Job not found" });
        }

        // Update job fields with new values

        // Assign values to the job object based on conditions
        if (jobTitle) {
            job.jobTitle = jobTitle;
        }
        if (location) {
            job.location = location;
        }
        if (jobType) {
            job.jobType = jobType;
        }
        if (salary) {
            job.salary = salary;
        }
        if (qualification) {
            job.qualification = qualification;
        }
        if (experience) {
            job.experience = experience;
        }
        if (desc) {
            job.desc = desc;
        }
        if (logo) {
            job.logo = logo;
        }
        if (status) {
            job.status = status;
        }
        
        // Save the updated job to the database
        const updatedJob = await job.save();
        console.log(updatedJob, 'updatedJob');
        // Return success response
        return res.json({ success: true, job: updatedJob });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const EditCompany = async (req, res) => {
    try {
        let {id, name, companyId, password, newpassword, imageUri, newPublicId, email, phone, address, location, desc } = req.body;
        console.log(req.body, 'req.body');

        let comapany_details=await Company.findById(id)

        let update = {};
        // Hash the new password if provided
        if (newpassword) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(newpassword, salt);
            update.password = secPass;
        }
        if (!newpassword) {
            update.password = password;
        }

        // Check if there's a change in hodId
        if (companyId) {
            // Generate authToken if there's a change in hodId
            const data = { id: companyId };
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
        if (email) {
            update.email = email;
        }
        if (address) {
            update.address = address;
        }
        if (phone) {
            update.phone = phone;
        }
        if (location) {
            update.location = location;
        }
        if (desc) {
            update.desc = desc;
        }
        if (comapany_details.publicId) {
            if (comapany_details.publicId !== newPublicId) {
                let Delete = await cloudinary.uploader.destroy(comapany_details.publicId)
                console.log(Delete, 'Deletee');
            }
        }
        // Update the Hod document
        const UpdateAll = await Company.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
        // If there's a change in hodId, include authtoken in the response
        if (update.authtoken) {
            console.log(update.authtoken, 'authtoken');
            res.json({ success: true, authtoken: update.authtoken, UpdateAll });
        } else {
            res.json({ success: true, UpdateAll });
        }

        // console.log(UpdateAll, 'UpdateAll');
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

const SingleJobDelete = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id, 'id123');
        let job = await Job.findByIdAndDelete(id);
        const success = true;
        res.json({ success, job, message: 'Deleted Successfully' })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

module.exports = { Login, Register, AddCompany, AllCompany, AddJob, CompanyJob, CheckRole, SingleJob, EditJob, EditCompany, SingleJobDelete }