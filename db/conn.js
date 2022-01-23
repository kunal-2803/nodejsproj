require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log("Connection Successful....");
}).catch((e)=>{
    console.log("NO connection ...");
})