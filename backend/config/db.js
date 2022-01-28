const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
       const conn=await mongoose.connect(process.env.MONGO_URI,{
           useNewUrlParser:true,
           useUnifiedTopology:true,
       });

       console.log(`mongodb connect :${conn.connection.host}`)
    }
    catch(e){
      console.log(`Error in DB Connection ${e.message}`)
      process.exit();
    }
}

module.exports=connectDB;