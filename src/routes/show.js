const router=require('express').Router();
const mongoose=require('mongoose');
const File = require('../models/file');

router.get('/:uuid',async(req,res)=>{
    try{
        const file= await File.findOne({uuid: req.params.uuid})
        if(!file){
            console.log('am here...')
            return res.render('download',{error:'the link is expired'})
        }
        else{
            return res.render('download',{
                uuid:file.uuid,
                fileName: file.filename,
                fileSize:file.size,
                downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            })
        }

    } catch(err){
        return res.render('download',{error:'something went wrong'})
    }
})
module.exports=router;