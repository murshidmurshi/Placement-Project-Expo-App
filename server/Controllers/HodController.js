const express = require('express')
const env = require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Hod = require('../Models/Hod')
// const cloudinary = require('cloudinary')
const cloudinary = require('../utils/Cloudinary'); // Replace './cloudinaryConfig' with the correct path to your module

const Login = async (req, res) => {
    try {
        const { hodId, password } = req.body
        let hod_details = await Hod.findOne({ hodId });
        if (!hod_details) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }

        const passwordCompare = await bcrypt.compare(password, hod_details.password)
        if (!passwordCompare) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const data = { id: hod_details?.hodId }
        const authtoken = jwt.sign(data, process.env.JWT_Secret);

        const success = true;
        console.log(authtoken, 'authtoken');
        res.json({ success, authtoken })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}

const AllHod = async (req, res) => {
    try {
        let hod = await Hod.find();
        const success = true;
        res.json({ success, hod })
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
        const user = await Hod.find({ hodId: userId });
        console.log(user, 'Hod');
        const success = true;
        res.json({ success, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}



const SingleHodDelete = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id, 'id');
        const hod = await Hod.findByIdAndDelete(id);
        if (!hod) {
            return res.status(404).json({ success: false, message: 'HOD not found' });
        }
        res.json({ success: true, message: 'HOD deleted successfully', hod });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Error!!!');
    }

}


const StudentHod = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id, '1111111111111');
        let hod = await Hod.find({ departmentId: id });
        console.log(hod, 'hod');
        const success = true;

        res.json({ success, hod })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}


const SingleHod = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id, 'id123');
        let hod = await Hod.findById(id);
        console.log(hod, 'hod');
        const success = true;
        res.json({ success, hod })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}

const EditHod = async (req, res) => {
    try {
        let { name, hodId, password, newpassword, department, imageUri, newPublicId, email, phone, address } = req.body;
        console.log(req.body, 'req.body');

        let hod_details = await Hod.findById(req.params.id);

        let update = {};

        if (!newpassword) {
            update.password = password;
        }
        // Hash the new password if provided

        if (newpassword) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(newpassword, salt);
            update.password = secPass;
        }
        console.log(newpassword,'newpasswordnewpasswordnewpassword Hod');
        

        // Check if there's a change in hodId
        if (hodId) {
            // Generate authToken if there's a change in hodId
            const data = { id: hodId };
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


        if (hod_details.publicId) {
            if (hod_details.publicId !== newPublicId) {
                let Delete = await cloudinary.uploader.destroy(hod_details.publicId)
                console.log(Delete, 'Deletee');
            }
        }
        // Update the Hod document
        const UpdateAll = await Hod.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
        console.log(UpdateAll, 'UpdateAll');
        // If there's a change in hodId, include authtoken in the response
        if (update.authtoken) {
            console.log(update.authtoken, 'authtoken');
            res.json({ success: true, authtoken: update.authtoken, UpdateAll });
        } else {
            res.json({ success: true, UpdateAll });
        }

        console.log(UpdateAll, 'UpdateAll');
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}




module.exports = { Login, AllHod, CheckRole, SingleHodDelete, StudentHod, SingleHod, EditHod }