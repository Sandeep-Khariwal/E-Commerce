import { ComparePassword, HashPassword } from "../Helper/helper.js";
import userSchema from "../Model/userSchema.js";
import User from "../Model/userSchema.js"
import  Jwt  from "jsonwebtoken";
import orderModel from "../Model/orderModel.js"

// code for User Registeration
export const userRegister = async(req,resp) =>{
  
    try {
        const { name,email,password,phone,address,answer } = req.body;
        const existingUser = await User.findOne({email:email});

        if(existingUser){
            return resp.send({
                success:false,
                messege:"User Already Registered"
            })
        }else{
            const hashedPassword = await HashPassword(password)
            const newUser = new User({name,email,phone,address,answer,password:hashedPassword}).save()
            resp.status(201).send({
                success:true,
                messege:"Registration Successfully",
                newUser
            })
        }

    } catch (error) {
        console.log(error);
        resp.status(400).send({
            success:false,
            messege:"Error While Register User"
        })

    }
}

// Code for Login 
export const LoginController = async(req,resp)=>{
    try {
        const {email,password} = req.body

        //check user is registered or not
        const user = await User.findOne({email})
        if(!user){
            return resp.status(404).send({
                success:false,
                messege:"Email is not Registered"
            })
        }

        // match the password
        const match = await ComparePassword(password,user.password)

        if(!match){
          resp.status(200).send({
            success:false,
            messege:"Invalid email and password"
          })
        }else{
        // create JWT here
        const token = await Jwt.sign({_id:user._id}, process.env.JWT_KEY ,{expiresIn:"7d"})
        resp.status(200).send({
            success:true,
            messege:"Login SuccessFully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })
    }
        
    } catch (error) {
        console.log("Error While LoginController",error);
        resp.status(500).send({
            success:false,
            messege:"Error While Login",
            error
        })
    }
}

// forgotPassword

export const forgotPassword = async(req,res) =>{
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
          res.status(400).send({ messege: "Emai is required" });
        }
        if (!answer) {
          res.status(400).send({ messege: "answer is required" });
        }
        if (!newPassword) {
          res.status(400).send({ messege: "New Password is required" });
        }
        //check
        const user = await User.findOne({ email, answer });
        //validation
        if (!user) {
          return res.status(404).send({
            success: false,
            messege: "Wrong Email Or Answer",
          });
        }
        const hashed = await HashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
          success: true,
          messege:"Password Reset Successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          messege: "Something went wrong",
          error,
        });
      }
}

// code for Test controller
export const testController = (req,resp)=>{
    try {
        resp.send("protected route")
    } catch (error) {
        console.log("Error in test controller",error);
    }
}



// admin dashboard
export const AdminDashboard = (req,resp)=>{
  resp.status(200).send({ok:true})
}

// update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userSchema.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await HashPassword(password) : undefined;
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

// order controller
export const getUserController = async(req,resp)=>{
  try {
    const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
    resp.json(orders)
  } catch (error) {
    console.log(error);
    resp.status(404).send({
      success:false,
      message:"Error while getting order",
      error
    })
  }
}