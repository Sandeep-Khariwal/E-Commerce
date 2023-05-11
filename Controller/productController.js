import productModel from "../Model/productModel.js";
import ObjectId from "bson-objectid"
import mongoose from "mongoose";
import fs from "fs";
import slugify from "slugify";
import CategoryModel from "../Model/CategoryModel.js";
import braintree from "braintree"
import orderModel from "../Model/orderModel.js";

// payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment:braintree.Environment.Sandbox,
//   merchantId:"bn8n8js75z5ftdfs",
//   publicKey:"w37rz4y25cv5x25b",
//   privateKey:"b461a49fcf8f543c5f642194dc13422e"
// });

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: `${process.env.BRAINTREE_MERCHANT_ID}`,
  publicKey: `${process.env.BRAINTREE_PUBLIC_KEY }`,
  privateKey: `${process.env.BRAINTREE_PRIVATE_KEY}`,
});

export const createProductController = async (req, res) => {
    const {name, description, price, category, quantity, shipping} = req.fields;
    const   {photo}  = req.files;
  try {
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
        case !shipping:
        return res.status(500).send({ error: "shipping is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
 
    // const objId = mongoose.Types.ObjectId(req.fields.category);
    const products = new productModel({...req.fields ,slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: error.message,
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};
// .select("-photo")
// .populate("category");
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
    
    
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    
    if(checked && radio){
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

      const products = await productModel.find({category:[...args.category],price:args.price});
    res.status(200).send({
      success: true,
      products,
    });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search controller

export const searchController = async(req,resp)=>{
  try {

    const {keyword} = req.params

    const result = await productModel.find({
      $or:[
        {name:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}}
      ]
    }).select("-photo")
    resp.json(result)
      
  } catch (error) {
    console.log("Error in searching product",error);
    resp.status(404).send({
      success:false,
      message:"Error in searching product",
      error
    })
  }
}

// get category with slug
export const categoriesProducts = async(req,resp)=>{
  try {
    const categories = await CategoryModel.findOne({slug:req.params.slug}) 
    const products = await productModel.find({category:categories.name })

    resp.status(200).send({
      success:true,
      message:"We found Products",
      categories,
      products
    })
  } catch (error) {
    console.log("Error in categories",error);
    resp.status(404).send({
      success:false,
      message:error.message
    })
  }
}

//payment gateway API
//get Token
export const braintreeTokenController = async(req,resp) =>{
  try {
    gateway.clientToken.generate({},function (err,response){
      if(err){
        resp.status(500).send({message:"error in creating clientToken",err})
        console.log("response is : ",err);
      }else{
        console.log(response);
        resp.send(response)
        console.log("response is : ",response);
      }
    })
  } catch (error) {
    console.log("Error in braintreeTokenCont",error);
  }
}

//payment
export const braintreePaymentController = async(req,resp) =>{
  try {
    const {cart,nounce} = req.body

    let total = 0;
    cart.map((i)=>{total+=cart.price})

    let newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nounce,
      options:{
        submitForSettlement:true
      }
    },
    function(err,result){
      if(result){
          const order = new orderModel({
            products:cart,
            payment:result,
            buyer:req.user._id
          }).save()
          resp.json({ok:true})
      }else{
        resp.status(500).send(err)
      }
    }
    )
  } catch (error) {
    
  }
}