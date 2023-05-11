import bcrypt from "bcrypt"

export const HashPassword = async(password) =>{
try{
    const saltRound = 10
    const  hashedPassword = await bcrypt.hash(password,saltRound)
    return hashedPassword
}catch(error){
    console.log("Error while password hashed",error);
}
}

export const ComparePassword = async(password,hashedPassword) =>{
    return bcrypt.compare(password,hashedPassword)
}