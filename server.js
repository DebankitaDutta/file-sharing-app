require('dotenv').config()
const bp = require("body-parser");
const cors = require('cors');
const express=require('express');
var favicon=require('serve-favicon')
const path = require('path');
const app=express();
const connectMDB= require('./src/config/db')
const scheduler=require('./services/scheduler_service')
const PORT= process.env.PORT ||4000

app.use(favicon(path.join(__dirname,'./assets/img','favicon.ico')))
app.use(cors({
    origin:'*',
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use('/public', express.static(path.join(__dirname, '/assets')));
// scheduler() //to delete the files from database which exceeds more than 24 hours

//apis
app.use('/api/files',require('./src/routes/file'))
app.use('/files',require('./src/routes/show'))
app.use('/files/download',require('./src/routes/download'))
app.use('/auth',require('./src/routes/auth')) // auth apis

app.get('/', (req, res ) => {
    return res.sendFile(path.join(__dirname, './assets/index.html'));

});

//setting up the view engine
app.set('view engine','ejs')
app.set('views','./views')

 connectMDB();
app.listen(PORT,()=>{
    console.log('server listens at ',PORT)
})
