
const router= require('express').Router();
const path=require('path')
const File=require('../models/file')

router.get('/:uuid',async(req,res)=>{
    const file= await File.findOne({uuid:req.params.uuid})
    if(!file){
        return res.render('download',{error:'link has been expired'})
    }
    const filePath=path.join(__dirname,`../../uploads/${file.filename}`)
    res.download(filePath)
})

module.exports=router