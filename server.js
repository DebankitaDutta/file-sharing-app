require('dotenv').config()
const bp = require("body-parser");
const cors = require('cors');
const express=require('express')
const app=express();
const connectMDB= require('./config/db')
const PORT= process.env.PORT ||4000


// app.use(restify.CORS());

// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//       next();
//     });

app.use(cors({
    origin:'*',
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}))

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//apis
app.use('/api/files',require('./routes/file'))
app.use('/files',require('./routes/show'))

//setting up the view engine
app.set('view engine','ejs')
app.set('views','./views')

connectMDB();
app.listen(PORT,()=>{
    console.log('server listens at ',PORT)
})
