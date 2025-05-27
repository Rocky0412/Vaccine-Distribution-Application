const Admin=require('../models/adminModel')
const bcrypt=require('bcryptjs')



const createDefaultAdmin=async ()=> {
  const existingAdmin = await Admin.findOne();
  if (!existingAdmin) {
    const defaultAdmin = new Admin(); // uses all default values from schema
    const hashedPassword=await bcrypt.hash(defaultAdmin.password,10)
    defaultAdmin.password=hashedPassword;
    await defaultAdmin.save();
    console.log("Default admin created.");
  } else {
    console.log("Admin already exists.");
  }
}


module.exports=createDefaultAdmin 
