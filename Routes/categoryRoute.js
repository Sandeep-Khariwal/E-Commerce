import express  from "express";
import { createCategoryControll, deleteCategory, getCategory, singleCategory, updateCategory } from "../Controller/categoryController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";

 const router = express.Router()

 // create category
 router.route("/create-category").post( requireSignIn ,isAdmin , createCategoryControll )

// update category
router.route("/update-category/:id").put(requireSignIn,isAdmin,updateCategory)

// get all category
router.route("/dashboard/admin/get-category").get(getCategory)

// get single category
router.route("/single-category/:slug").get(singleCategory)

router.route("/get-category").get(getCategory)

// delete single category
router.route("/delete-category/:id").delete( requireSignIn, isAdmin , deleteCategory)

 export default router