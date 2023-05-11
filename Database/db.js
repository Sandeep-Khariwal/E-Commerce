import mongoose from "mongoose"

export const DataBase = async() =>{
    try{
        
       await mongoose.connect(process.env.DB_URL,{useUnifiedTopology:true,useNewUrlParser:true})
       console.log(`Data_Base Connected Successfully`);
    }catch(error){
        console.log(`Error while Connecting Data Base`,error);
    }
}
