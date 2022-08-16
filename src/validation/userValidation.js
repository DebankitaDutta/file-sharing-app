const admin=require('../config/firebaseAdmin')
const bcrypt=require('bcrypt')
db=admin.firestore()
db.settings({ timestampsInSnapshots: true });

async function signupUserValidation(userDetails) {
    const{username,email,password,confirmPassword,phoneNumber}=userDetails

    if(!email || !password ||!password ||!confirmPassword ||!phoneNumber){
        return "All fields are required"
    }
    if(password.length>6 && /[!@#$%^&]/.test(password) && /[A-Z]/.test(password)&& /[a-z]/.test(password) && /[0-9]/.test(password)){
        console.log('ok')
    }else{ 
        return "password should contains atleast 6 characters that are combinations of letter digits and special characters"
    }

    if(password!=confirmPassword){
        console.log(password,'  ',confirmPassword)
       return "both passwords are not matching"
    }
    if(phoneNumber.length!=10){
       return "phone number length should be 10"
    }
    if(/^[0-9]+$/.test(phoneNumber)){
    console.log('phone no is correct')
    }
    else{
    return "phone number should only contains digits"
    }
    
     //if email exists

    const userRef=db.collection('users')
    const emailExists= await userRef.where('email','==',email).get();
    if (!emailExists.empty) {
        return "email id already exists"
    }
    return ""
}

 async function loginUserValidation(loginUserDetails){
    console.log('loginUserdetails******',loginUserDetails)
    const{email,password}=loginUserDetails
    if(!email || !password){
        return "all fields are required"
    }
     //if email already exists

    const  userExist= await userExists(email)
    return userExist
}

async function forgotPasswordEmailValidation(email){
   if(!email){
        return "email id is required"
    }
     //if email already exists
    const  userExist= await userExists(email)
    return userExist
}

 async function userExists(email){
    const userRef=db.collection('users');
    const emailExists= await userRef.where('email','==',email).get();
    if (emailExists.empty) {
        return "A user with this email does not exist"
    } 
    return ""
}

module.exports={signupUserValidation,loginUserValidation,forgotPasswordEmailValidation}
