import  JWT from "jsonwebtoken";
import User from "../Model/userSchema.js";

export const requireSignIn = async(req,resp,next)=> {
    try {
      const decode = JWT.verify(req.headers.authorization, process.env.JWT_KEY)
      req.user = decode
      next()
    } catch (error) {
        console.log("Error in requireSignIn",error);
    }
}

// check admin
export const isAdmin = async(req,resp,next)=>{
try {
    const user = await User.findOne({_id:req.user._id})

    if(user.role !== 1){
     return resp.status(404).send({
        success:false,
        messege:"unAuthorized user"
     })
    } else{
        next()
    }
} catch (error) {
    console.log(error);
}
}