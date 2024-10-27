const express = require('express')
const router = express.Router()

const {Login, Register,AddHod,AddDepartment,GetAllDepartments,AddStudent,CheckRole,DeleteDepartment, UpdateCompanyStatus} = require('../Controllers/AdminController')

router.post("/auth",CheckRole)
router.post("/register",Register)

router.post("/login",Login)



router.post("/addHod",AddHod)
router.post("/addStudent",AddStudent)

router.post("/addDepartment",AddDepartment)

router.get("/getAllDepartments",GetAllDepartments)
router.delete("/department/delete/:id",DeleteDepartment)
router.post("/company/:id",UpdateCompanyStatus)


module.exports=router