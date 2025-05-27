const express=require('express')
const dotenv=require('dotenv')
const db=require('./Config/connectDB')
const hospital_router = require('./routes/hospitalRoutes.js')
const createDefaultAdmin = require('./Config/defaultEntry.js')
//.env file 
dotenv.config()
const port=  process.env.PORT
//database connections
db()
//create default Admin
createDefaultAdmin()

//app
const app=express()

//body-parser json
app.use(express.json());

//Router middleware
app.use('/',require('./routes/userRoutes.js'))
app.use('/',require('./routes/hospitalRoutes.js'))
app.use('/',require('./routes/adminRoutes.js'))



//crete server
app.listen(port,()=>{
	console.log(`server is running ${port}`)
})