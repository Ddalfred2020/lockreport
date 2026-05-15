

const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const LOCKREPORT = require("./model/lockreport")
const  methosOverride = require("method-override")
const authrouter = require("./Router/authrouter")
const cookieParser = require("cookie-parser")
const { requireAuth, checkUser} = require("./middleware/authmiddleware")

const app = express()



// Replace the placeholder with your Atlas connection string
const uri ="mongodb://dbalfred:Abrahim_2026@ac-3ht7xoi-shard-00-00.lhkdals.mongodb.net:27017,ac-3ht7xoi-shard-00-01.lhkdals.mongodb.net:27017,ac-3ht7xoi-shard-00-02.lhkdals.mongodb.net:27017/db_lockreport?ssl=true&replicaSet=atlas-11d0kq-shard-0&authSource=admin&appName=Cluster0"
mongoose.connect(uri)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.error("Error connecting to MongoDB:", err));
app.listen(3000)
app.set('view engine', 'ejs')


app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(methosOverride('_method'))
app.use(express.json())
app.use(cookieParser())


app.use(authrouter)

//app.get("*",checkUser)
app.use(checkUser)


app.get("/about",(req,res)=>{ 
  res.render("about",{title:'About page'})
})
app.get("/create",(req,res)=>{
   res.render("create",{title:"Create Lock Report"})    
})


app.get("/",(req,res)=>{
   res.render("index",{user:res.locals.user,title:"This is  the home page"})    
})


app.get("/lockreports", requireAuth ,(req,res)=>{   
   LOCKREPORT.find()
       .then(result =>{
          res.render("lockreports",{user:res.locals.user,result,title:"All Lock Reports"}) 
       })
       .catch((err)=>{
         console.log("Error saving lock report:", err);
       }) 
 })

app.post("/lockreports",(req,res)=>{   
   const lockreport = new LOCKREPORT(req.body)
    lockreport.save()
    .then(result =>{
       res.redirect("/lockreports") 
    })
    .catch((err)=>{
      console.log("Error saving lock report:", err);
    })
})
app.get("/lockreports/update/:id",(req,res)=>{
  const id =req.params.id
   LOCKREPORT.findById(id)
      .then(result =>{
         res.render("update",{user:res.locals.user,result,title:"Update Lock Report"}) 
      })
      .catch((err)=>{
        console.log("Error saving lock report:", err);
      })
})

app.get("/lockreports/:id",(req,res)=>{
  const id =req.params.id
    LOCKREPORT.findById(id)
       .then(result =>{
          res.render("detail",{result,title:"Lock Report Details"}) 
       })
       .catch((err)=>{
         console.log("Error saving lock report:", err);
       })
})

app.put("/lockreports/:id",(req,res)=>{
  const id =req.params.id
    LOCKREPORT.findByIdAndUpdate(id,req.body,{new:true})
    .then(((result)=>{
      res.redirect("/lockreports")
    }))
    .catch(error=>{
      console.log("could not update report",error)
    })
})
app.delete("/lockreports/:id",(req,res)=>{
  const id =req.params.id
    LOCKREPORT.findByIdAndDelete(id)
    .then((response)=>{
     res.json({redirect:"/lockreports"})
    })
    .catch(error=>{
      console.log("could not update report",error)
    })
})


app.use((req,res)=>{
   res.status(404).render("404",{title:"This is a 404 page"})
})