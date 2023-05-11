import CategoryModel from "../Model/CategoryModel.js";
import slugify from "slugify";

`mongoose.set('strictQuery', true);`

export const createCategoryControll = async(req,resp) =>{
    try {

        const  {name}  = req.body
        const existCategory = await CategoryModel.findOne({name})

        if(existCategory){
            resp.status(200).send({
                success:true,
                message:"Category already exist"
            })
        }else{
            
        const Category = await new CategoryModel({ name , slug:slugify(name)}).save()
        resp.status(201).send({success:true , message:"Category added" , Category})
        }
        
    } catch (error) {

        console.log(error);
        resp.status(500).send({success:false,message:error.message})
    }
}

//update category
export const updateCategory = async(req,resp) => {
    try {
        const {name} = req.body
        const {id} = req.params

        const Category = await CategoryModel.findByIdAndUpdate(id,{name , slug:slugify(name)},{new:true})
        resp.status(200).send({success:true,message:"Category updated successfully",Category})

    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success:false,
            message:error.message
        })
    }
}

// get all category
export const getCategory = async(req,resp)=>{
    try {
        const Category = await CategoryModel.find({});
        resp.status(200).send({success:true,message:"all category fetched",Category})
    } catch (error) {
        console.log(error);
        resp.status(500).send({success:false,message:error.message})
    }
}
// get single category
export const singleCategory = async(req,resp)=>{
    try {
        const Category = await CategoryModel.findOne({slug:req.params.slug});
        resp.status(200).send({success:true,message:"category fetched",Category})
    } catch (error) {
        console.log(error);
        resp.status(500).send({success:false,message:error.message})
    }
}

// get single category
export const deleteCategory = async(req,resp)=>{
    try {
        const {id} = req.params
        const Category = await CategoryModel.findByIdAndDelete(id);
        resp.status(200).send({success:true,message:"category deleted"})
    } catch (error) {
        console.log(error);
        resp.status(500).send({success:false,message:error.message})
    }
}
