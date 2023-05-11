import mongoose from "mongoose";

const categorySchema =  mongoose.Schema({
    name:{
        type:String,
        require:true,
    },

    slug:{
        type:String,
        lowercase:true
    }
})

export default mongoose.model("categories",categorySchema)