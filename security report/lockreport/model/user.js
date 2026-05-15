const mongoose = require("mongoose")
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')



const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String,
        required:[true,'please enter the email address'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'please provide a valid email address']
    },
     password:{
        type:String,
        required:[true,'please enter the email address'],
        minlength:[6,'password must be six characters long'],
       
    }
})



     userSchema.pre("save", async function(){
     const salt = await bcrypt.genSalt()
     this.password = await bcrypt.hash(this.password, salt)
     
}) 
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
     const auth = await bcrypt.compare(password,user.password)
      if(auth){
        return user
      }
      throw Error('incorrect password was entered')
    }
    throw Error('incorrect email was entered')
}
    
const USER = mongoose.model('user',userSchema)

module.exports = USER