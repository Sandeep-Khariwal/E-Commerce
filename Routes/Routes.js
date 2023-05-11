import express from "express";
import { AdminDashboard, forgotPassword, getUserController, LoginController, testController, updateProfileController, userRegister } from "../Controller/userController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";

const router = express.Router()

// Registration Request || POST Method
router.route("/register").post(userRegister)

// Login Request || POST Method
router.route("/login").post(LoginController)

// test Route
router.route("/test").get(requireSignIn, isAdmin ,testController)

// forgotPassword
router.route("/forgot-password").post( forgotPassword )

// protected route for user-auth
router.route("/user-auth").get(requireSignIn,(req,resp)=>{
    resp.status(200).send({ok:true})
})

// protected route for admin -auth
router.route("/admin-auth").get(requireSignIn, isAdmin, AdminDashboard)

// profile
router.route("/profile").put(requireSignIn,updateProfileController)

// order route
router.route("/orders").get(requireSignIn,getUserController)

export default router