const express = require('express')
const router = express.Router()

const {Login,AllHod,CheckRole,SingleHodDelete, StudentHod, SingleHod,EditHod} = require('../Controllers/HodController')

router.post("/login",Login)
router.post("/auth",CheckRole)
router.get("/allHod",AllHod)
router.post("/hod/:id",SingleHod)

router.delete("/delete/:id",SingleHodDelete)
router.get("/student/hod/:id",StudentHod)

router.post("/edit/:id",EditHod)


module.exports=router