const express = require('express')
const env = require('dotenv').config()
const cors = require('cors')

const ConnectToMongo = require("./database")
ConnectToMongo()


const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/admin", require('./Routes/AdminRoutes'))
app.use("/api/hod", require('./Routes/HodRoutes'))
app.use("/api/student", require('./Routes/StudentRoutes'))
app.use("/api/company", require('./Routes/CompanyRoutes'))

app.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`)
})