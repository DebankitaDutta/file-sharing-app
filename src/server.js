require('dotenv').config()
const bp = require("body-parser");
const cors = require('cors');
const express=require('express');
const path = require('path');
const app=express();
const connectMDB= require('./config/db')
const PORT= process.env.PORT ||4000


app.use(cors({
    origin:'*',
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}))
app.use('/public', express.static(path.join(__dirname, '../assets')));

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//apis
app.use('/api/files',require('./routes/file'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))
app.use('/auth',require('./routes/auth')) // auth apis

app.get('/', (req, res ) => {
    return res.sendFile(path.join(__dirname, './index.html'));
});

//setting up the view engine
app.set('view engine','ejs')
app.set('views','./views')

 connectMDB();
app.listen(PORT,()=>{
    console.log('server listens at ',PORT)
})
