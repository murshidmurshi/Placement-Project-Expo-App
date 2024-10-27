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

const Register = async (req, res) => {
    try {
        const { AdminId,password } = req.body;
        let admin_details = await AdminSchema.findOne({ AdminId })
        if (admin_details) {
            const success = false;
            return res.json({ success, error: "This AdminId already exist" })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);

            const newAdmin = new AdminSchema({password: secPass,AdminId });

            const savedAdmin = await newAdmin.save()

            const success = true;
            return res.json({ success, savedAdmin })
        }
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Error!!!")
    }
}

const Login = async (req, res) => {
    try {
        const { AdminId, password } = req.body
        console.log(AdminId, password,'Id, password');

        let admin_details = await AdminSchema.findOne({ AdminId });
        if (!admin_details) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const passwordCompare = await bcrypt.compare(password, admin_details.password)
        if (!passwordCompare) {
            const success = false;
            return res.json({ success, error: "Invalid Id or Password" })
        }
        const data = { id: admin_details.AdminId }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        const success = true;
        res.json({ success, authtoken,message:'Successfull' })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}

const AddHod = async (req, res) => {
        try {
            const { name, hodId, department,departmentId, password, imageUri,publicId } = req.body;
            // console.log(req.body,'req.body');
            let hod_details = await Hod.findOne({ hodId })
            if (hod_details) {
                const success = false;
                return res.json({ success, error: "Id already exist" })
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(password, salt);
                const newHod = new Hod({password: secPass,name:name,hodId:hodId,department,departmentId,avtar:imageUri,publicId });
                const savedhod = await newHod.save()
                console.log(savedhod,'savedhod');
                await Department.updateOne({ _id: departmentId }, {hodId: savedhod._id });
                const success = true;
                return res.json({ success, savedhod })
            }
        }
        catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Error!!!")
        }
}
const AddDepartment = async (req, res) => {
        try {
            const { name } = req.body;
            console.log(req.body,'req.body');
            let Department_detail = await Department.findOne({ name })
            if (Department_detail) {
                const success = false;
                return res.json({ success, error: "This Department already exist" })
            }
            else {
                const newDepartment = new Department({name:name });
    
                const savedDepartment = await newDepartment.save()
                const success = true;
                return res.json({ success, savedDepartment })
            }
        }
        catch (error) {
            console.log(error.message)
            res.status(500).send("Internal Error!!!")
        }
}

const GetAllDepartments = async (req, res) => {
    try {
       let departments=await Department.find();
        const success = true;
        res.json({ success, departments })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }

}


const AddStudent = async (req, res) => {
    try {
        const { name, studentId, department,departmentId, password, imageUri,publicId } = req.body;
        console.log(req.body,'req.body');
        let student_details = await Student.findOne({ studentId })
        if (student_details) {
            const success = false;
            return res.json({ success, error: "Id already exist" })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);

            const newStudent = new Student({password: secPass,name:name,studentId:studentId,department,departmentId,avtar:imageUri,publicId });
            const savedStudent = await newStudent.save()
            const success = true;
            console.log(savedStudent,'savedStudent');
            return res.json({ success, savedStudent })
        }
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Error!!!")
    }
}


const CheckRole = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;
        console.log(token,'token');
        // Decode the token to get the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded,123456);
        // Extract the user ID from the decoded payload
        const userId = decoded.id;
        const user = await Admin.find({AdminId:userId});
        console.log(user,'admin');
        const success = true;
        res.json({ success, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error!!!");
    }
}


const DeleteDepartment = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      
      // Check if the department exists
      const checkDepartment = await Department.findById(id);
      
      if (checkDepartment) {
        // If the department exists, delete it
        const departmentDetail = await Department.findByIdAndDelete(id);
        console.log(departmentDetail, 'Department_detail');
        const success = true;
        return res.json({ success, message: 'Department deleted successfully' });
      } else {
        // If the department does not exist, return an error
        const success = false;
        return res.json({ success, error: 'Department not found' });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Error!!!');
    }
  };

  const UpdateCompanyStatus = async (req,res) => {
    try {

        let id=req.params.id;


        let {status}=req.body;
        // Find the company document by companyId and update its status
        const updatedCompany = await Company.findByIdAndUpdate(
            id, // ID of the company document to update
            { $set: { status: status } }, // Set the new status
            { new: true } // Return the updated document after the update
        );
        // Check if the company document was found and updated successfully
        if (!updatedCompany) {
            // Handle the case where the company document with the given ID was not found
            console.log('Company not found');
           return res.json({success: false,message: 'Company not found'});
        }else{
           return res.json({success: true,message: 'Company Status updated successfully'});
        }

        // Log or return the updated company document
        console.log('Updated company:', updatedCompany);
        return updatedCompany;
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating company status:', error);
        throw error; // Re-throw the error for further handling or return null
    }
};

module.exports = { Login, Register,AddHod,AddDepartment,GetAllDepartments,AddStudent,CheckRole,DeleteDepartment,UpdateCompanyStatus}