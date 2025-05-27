const dotenv=require('dotenv');
const mongoose= require('mongoose'); 

dotenv.config();

const colors=require('colors');
 

const connectDB= async ()=>
{
	try {
		await mongoose.connect(process.env.MOGODB_URL);
		console.log(`Database is connected ${mongoose.connection.host}`.bgGreen );

	} 
	catch (error) {
		console.log('Db is unable to connect');
	}
}

module.exports=connectDB;