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

module.exports= router
