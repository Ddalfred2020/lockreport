const mongoose = require("mongoose")

const Schema = mongoose.Schema

const lockreportSchema = new Schema({
    operative:{
        type:String,
        required:true
    },
     supervisor:{
        type:String,
        required:true
    },
     details:{
        type:String,
        required:true
    },
     taken:{
        type:String,
        required:true
    },
     advice:{
        type:String,
        required:true
    },
     recommendation:{
        type:String,
        required:true
    },
},{timestamps:true})

const LOCKREPORT = mongoose.model('LOCKREPORT',lockreportSchema)

module.exports = LOCKREPORT