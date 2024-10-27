const express = require('express')
const router = express.Router()

const {AddCompany,AllCompany,AddJob,CompanyJob,Login,Register,CheckRole,SingleJob,EditJob, EditCompany, SingleJobDelete} = require('../Controllers/CompanyController')

router.post("/register",Register)
router.post("/login",Login)
router.post("/auth",CheckRole)
router.post("/add",AddCompany)
router.get("/allCompany",AllCompany)
router.post("/addJob",AddJob)

router.post("/companyJob/:id",CompanyJob)
router.post("/job/:id",SingleJob)
router.post("/job/edit/:id",EditJob)
router.post("/edit/:id",EditCompany)
router.delete("/delete/:id",SingleJobDelete)
module.exports=router