const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv').config()

const ConnectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MongoURI)
        console.log("Connect to MongoDB Success")
    }
    catch (err) {
        console.log("Unsuccess "+ err)
    }
}

module.exports=ConnectToMongo