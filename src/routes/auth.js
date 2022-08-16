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
   console.log('*************',newUser)
// request body validation

    errMsg= await signupUserValidation(newUser)
    if(errMsg!=""){
        return res.status(201).json({
            msg:errMsg
        })
    }
    
//hashing the password with bcrypt
   const hashedPassword=await brcypt.hash(newUser.password,10)
   newUser.password=hashedPassword
   newUser.confirmPassword=hashedPassword


// signup code

auth.createUserWithEmailAndPassword(authentication,email,password)
.then(async(userCred)=>{
    const response= await db.collection('users').doc(userCred.user.email).set(newUser);  //storing data into firebase

    return res.status(200).json({'msg':"successfully signedup."})
    }).catch((error)=>{
        console.log(error)
    })
})

//login api
router.post('/login',async(req,res)=>{
    console.log('inside login route')
    // console.log(req.body)
    console.log(req.body.email)
    console.log(req.body.password)
    // object destructuring
    const{email,password}= req.body;

    const loginUser={
        email,
        password
    }
    console.log('loginUser******',loginUser)
    //login user details validation

    errMsg= await loginUserValidation(loginUser)
    // console.log('********8errMsg from auth.js login 3*****',errMsg)
    if(errMsg!=""){
        // console.log('********errMsg from auth.js login 4*****',errMsg)
        return res.status(201).json({msg:errMsg})
    }
    //fetching the user using it's unique email id

    fetchUserByEmail= await db.collection('users').doc(email).get()
    const actualHashedPassword=fetchUserByEmail.data().password
    brcypt.compare(password,actualHashedPassword,(error,isEqual)=>{
        if(!isEqual){
           return res.status(401).json({msg:'please enter a valid password'})
    }
        
    //user logging in

        auth.signInWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
            console.log('logged in')
           return res.status(200).json({msg:'successfully logged in'})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.send(errorCode).json('msg',errorMessage)
        })
    })

})


//logout
router.get('/logout',async(req,res)=>{

    auth.signOut(authentication).then(()=>{
       return res.json({"msg":"successfully logged out"})
    }).catch(err=>{
        return res.json({"error":err})
    })
})
            


module.exports=router