const nodeMailer=require('nodemailer');
 function sendMail({from,to,subject,text,htmlTemplate}){
    let transport=nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure:false,
        auth:{
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    })
    const mailOptions={
        from: `shareKaro <${from}>`,
        to,
        subject,
        text,
        html: htmlTemplate
    }
     transport.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
    })
}
module.exports=sendMail;