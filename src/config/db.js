const mongoose= require('mongoose')
require('dotenv').config();
 function connectDB(){
   mongoose.connect(process.env.MONGO_CONNECTION_URL,{ useNewUrlParser: true, useUnifiedTopology: true});
    const connection= mongoose.connection;
    connection.once('open',()=>{
        console.log("database connected")
    }).on('error', err=>{
        console.log("db connection failed ", err)
    })
 }

 module.exports=connectDB