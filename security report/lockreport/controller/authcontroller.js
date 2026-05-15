
const USER = require('../model/user');

const jwt = require("jsonwebtoken")




const handleError = (err)=>{
    console.log(err.message,err.code)

    let errors = {email:"",
        password:"" }

         if(err.message === 'incorrect email was entered'){
            errors.email = "that email is not registered"
        }
         if(err.message === 'incorrect password was entered'){
            errors.password = "that password is incorrect"
        }


    if(err.code === 11000){
        errors.email = "that email is already registered"
        return errors
    }
       
      if(err.message.includes('user validation failed')){
          Object.values(err.errors).forEach(({properties})=> {
            errors[properties.path] = properties.message
        })
           
    }
       return errors
}
const maxAge = 3*24*60*60

const createToken = (id)=>{
return jwt.sign({id},'memphis lodge traditional martinist order secret',{
    expiresIn:maxAge}) 
}

module.exports.login_get = (req,res)=>{
 res.render("login",{title:"Login page"})
}

module.exports.login_post = async (req,res)=>{ 

   const {email,password} = req.body 

    try{
        const user = await USER.login(email, password)
         const token =  createToken(user._id)
        res.cookie('jwt',token,
        {httpOnly:true,
        maxAge:maxAge*1000});
        res.status(201).json({user:user._id})
    }catch(error){
       const errors =  handleError(error)
       res.status(401).json({errors})
    }
}

module.exports.signup_get = (req,res)=>{
 res.render("signup",{title:"Sign Up page"})
}

module.exports.signup_post =async (req,res)=>{
 const {email,password} = req.body
 try {
     const user = await USER.create({email,password})
     const token =  createToken(user._id)
     res.cookie('jwt',token,
        {httpOnly:true,
        maxAge:maxAge*1000});
     res.status(201).json({user:user._id})
  } catch (error) {
   const errors =  handleError(error)
    res.status(401).json({errors})
 } 

}
module.exports.logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect("/")
}

