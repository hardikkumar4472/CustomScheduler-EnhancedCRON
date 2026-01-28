const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`Connected Successfully`);
    }
    catch (err){
        console.log("error connecting to mongoDB", err.message);
        // console.log(`${process.env.MONGO_URI}`);
    }
}
module.exports=connectDB;