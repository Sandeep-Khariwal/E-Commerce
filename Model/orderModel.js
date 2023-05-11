import mongoose from "mongoose";

const orderSchema =  mongoose.Schema({
   product:[
    {
        type:mongoose.ObjectId,
        ref:"Products",
    },
   ],
   payment:{},
   buyer:{
    type:mongoose.ObjectId,
    ref:"users"
   },
   statusbar:{
    type:String,
    default:"Not Process",
    enum:["Not Process","Processing","Shipped","Delivered","Cancel"]
   },
},{timestamps:true})

export default mongoose.model("order",orderSchema)