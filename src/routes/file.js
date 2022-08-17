const multer= require('multer')
const path=require('path')
const router= require('express').Router()
const File= require('../models/file')
const{ v4:uuidv4}= require('uuid')
require('dotenv').config()

let storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null, 'uploads/'),
    filename: (req,file,cb)=>{
        const uniqueName= `${Date.now()}-${Math.random()*1E9}${path.extname(file.originalname)}`
        cb(null,uniqueName)
    },
});
const upload=multer({
    storage,
    limits:{fileSize:  1000000*100}
}).single('myfile');


//file upload route
    
router.post('/',(req,res)=>{
    try{
        upload(req,res,async(err)=>{
            console.log('file**********',req.file)
            if(!req.file){
                return res.json({err:'please upload a file'})
            }
            if(err){
               return res.status(500).send({error: err.message})
            }
            const file=new File({
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                uuid: uuidv4()
    
            })
            const response= await file.save();
            return res.json({file: `${process.env.APP_BASE_URL}/files/${file.uuid}`})
        })
    }catch(err){
        console.log("error",error.message)
    }
})

//email sending route

router.post('/send',async(req,res)=>{
    const{uuid,emailFrom,emailTo}=req.body
    console.log(uuid,' ',emailFrom,' ',emailTo)

    //validate request
    if(!uuid || !emailFrom ||!emailTo){
        return res.status(422).send({msg:'All fields are required'})
    }
    // get data from db
    const file= await File.findOne({uuid:uuid})
    if(file.sender){
        return res.status(422).send({msg:'email is already sent!'})
    }
    file.sender=emailFrom
    file.receiver=emailTo
    const response=await file.save();

    //send mail
    const sendMail=require('../../services/mail_services');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'ShareKaro file sharing',
        text:`${emailFrom} shared a file with you`,
        htmlTemplate:require('../../services/htmlTemplate')({
            size: parseInt(file.size/1000) +'KB',
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            emailFrom:emailFrom,
            expires:'24 hours'
        })
    }) 
    res.send({msg: 'success'})
})

module.exports= router
