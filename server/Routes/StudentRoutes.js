const express = require('express')
const router = express.Router()
const {Login,AllStudent, CheckRole,SingleStudentUpdateStatus,HodStudent, EditStudent,AllRequest, UpdateRequest,AllStudentRequest} = require('../Controllers/StudentController')

router.post("/login",Login)
router.post("/auth",CheckRole)
router.get("/allStudent",AllStudent)
router.get("/hod/student/:id",HodStudent)
router.post("/updateStatus/:id",SingleStudentUpdateStatus)
router.post("/edit/:id",EditStudent)

router.get("/request/filter",AllRequest)
router.post("/request/student/:id",AllStudentRequest)
router.post("/request/:id",UpdateRequest)


module.exports=router