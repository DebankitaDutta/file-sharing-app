const router=require('express').Router();
const firebase=require('../config/firebaseConfig')
const admin=require('../config/firebaseAdmin')
const auth=require("firebase/auth")
const brcypt=require('bcrypt')
const {signupUserValidation,loginUserValidation,forgotPasswordEmailValidation}= require('../validation/userValidation')
const authentication = auth.getAuth();

const db=admin.firestore();

 //signup api 
router.post('/signup',async(req,res)=>{
   const{username,email,password,confirmPassword,phoneNumber}=req.body
   const newUser={
    username,
    email,
    password,
    confirmPassword,
    phoneNumber
   }
// request body validation

    errMsg= await signupUserValidation(newUser)
    if(errMsg!=""){
        return res.status(201).json({
            error:errMsg
        })
    }
    
//hashing the password with bcrypt
   const hashedPassword=await brcypt.hash(newUser.password,10)
   newUser.password=hashedPassword

// signup code

auth.createUserWithEmailAndPassword(authentication,email,password)
.then(async(userCred)=>{
    const response= await db.collection('users').doc(userCred.user.email).set(newUser);  //storing data into firebase

    return res.json({'success':"successfully signedup."})
    }).catch((error)=>{
        console.log(error)
    })
})

//login api
router.post('/login',async(req,res)=>{
    // object destructuring
    const{email,password}= req.body;
    const loginUser={
        email,
        password
    }
    //login user details validation

    errMsg= await loginUserValidation(loginUser)
    // console.log('********8errMsg from auth.js login 3*****',errMsg)
    if(errMsg!=""){
        // console.log('********errMsg from auth.js login 4*****',errMsg)
        return res.status(201).json({error:errMsg})
    }
    //fetching the user using it's unique email id

    fetchUserByEmail= await db.collection('users').doc(email).get()
    const actualHashedPassword=fetchUserByEmail.data().password
    brcypt.compare(password,actualHashedPassword,(error,isEqual)=>{
        if(!isEqual){
           return res.status(401).json({error:'please enter a valid password'})
    }
        
    //user logging in

        auth.signInWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
           return res.status(200).json({msg:'successfully logged in'})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.send(errorCode).json('msg',errorMessage)
        })
    })

})

//forgot password
router.post('/forgotPassword',async(req,res)=>{

    const email=req.body.email;
    const authentication = auth.getAuth();
    errMsg= await forgotPasswordEmailValidation(email)
    if(errMsg!=''){
        return res.status(510).json({error:errMsg})
    }
    
    //password resetting
    auth.sendPasswordResetEmail(email)
    .then((response)=>{
        console.log('response',response)
        return res.json({msg:'password reset email has sent.'})
    }).catch(err=>{
        console.log('inside catch err')
        console.log(err.code)
        console.log(err.message)
    })

    return res.json({'status':'ok'})
})
            
//signin with google



module.exports=router