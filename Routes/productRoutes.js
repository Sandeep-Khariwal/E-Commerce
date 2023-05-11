
import express from "express";
import {
  braintreePaymentController,
  braintreeTokenController,
  categoriesProducts,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  searchController,
  updateProductController,
} from "../Controller/productController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes  // formidable(),
router.route("/create-product").post(
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//routes
router.route("/update-product/:pid").put(
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.route("/get-product").get( getProductController);

//single product
router.route("/get-product/:slug").get( getSingleProductController);

//get photo
router.route("/product-photo/:pid").get(productPhotoController);

//delete rproduct
router.route("/product/:pid").delete(deleteProductController);

//filter product
router.route("/product-filters").post(productFiltersController)

//product count
router.route("/product-count").get(productCountController)

//product per page
router.route("/product-list/:page").get(productListController)

// search product
router.route("/search/:keyword").get(searchController)

// categories with slug
router.route("/categories/:slug").get(categoriesProducts);

//payment Route
router.route("/braintree/token").get( braintreeTokenController)

//payment
router.route("braintree/payment").post(requireSignIn,braintreePaymentController)

export default router;