const scheduler=require('node-schedule');
const File= require('../src/models/file');
// const minute = 1000 * 60;
// const hour = minute * 60;
// const day = hour * 24;
// const year = day * 365;
// const second=60000;
function scheduleJob(){

    const nowTime= new Date().getTime();
    const mins=24*60*60*1000;
    scheduler.scheduleJob('delete-link-scheduler','0 * * * *',async()=>{
        deleteFileStatus=await File.deleteMany({"createdAtMs":{ $lte: nowTime-mins}})
    //    console.log(deleteFileStatus)
    })
}

module.exports=scheduleJob