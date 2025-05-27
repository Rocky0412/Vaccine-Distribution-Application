const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema=mongoose.Schema({
	Name:{
		type:String,
		required:[true,"User name is required"]
	},
	Surname:{type:String,required:true},
	email:{type:String,required:[true,"email is required"],unique:true},
	password:{type:String,required:[true,"Password is require"]},
	Address:{type:String},
	status:{type:String,enum:["Not vaccinated","Patial","Fully Vacinated"],
		default:"Not vaccinated"},
	DOB:{type:Date},
	no_vaccine:{type:Number, default:0,Min:0,Max:2}


},{timestamps:true})


//hooks
userSchema.pre('save', function (next) {
  if (this.no_vaccine === 1) {
    this.status = "Patial";
  } else if (this.no_vaccine === 2) {
    this.status = "Fully Vaccinated";
  } else {
    this.status = "Not vaccinated";
  }
  next();
});

module.exports=mongoose.model('users',userSchema);