require('dotenv').config();
const express =require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth  = require("./middleware/auth");

require("./db/conn");
const Regmail = require("./models/regmail");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"./public");
const template_path = path.join(__dirname,"./templates/views");
const partials_path = path.join(__dirname,"./templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path));
app.set("view engine" , "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);



app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/",(req,res)=>{
    res.render("index");
});

///////////register////////
app.post("/register",async(req,res)=>{
    try{
        
            const user = new Regmail({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                phonenumber:req.body.phonenumber
            })
            const token = await user.generateAuthToken();
            console.log("The tokent part "+token);

            res.cookie("jwt",token,{
                expires : new Date(Date.now()+600000),
                httpOnly:true
            });

            const regdata = await user.save();
            res.status(201).render("index");

            var transporter = nodemailer.createTransport({
                service : 'gmail',
                auth:{
                    user:'psd009902@gmail.com',
                    pass:'Kunal@123'
                }
            });
            
            var mailOptions ={
                from:'psd009902@gmail.com',
                to:user.email,
                subject:'Demo email',
                text:'Hi this is Kunal Thank you for Logging in Travello .I have made Travello a complete dynamic website including validations with node.js!!'
            };
            
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Email sent:'+info.response);
                }
            });

            }catch(error){
        res.status(400).send(error);
    }
});

app.post("/",async(req,res)=>{
    try{
            const email= req.body.email;
            const password = req.body.password;
            const nameu = req.body.name;
            const usermail = await Regmail.findOne({email:email});
            const isMatching =await bcrypt.compare(password,usermail.password);
            const token = await usermail.generateAuthToken();
            console.log("The tokent part "+token);

            res.cookie("jwt",token,{
                expires : new Date(Date.now()+600000),
                httpOnly:true
            });

            if(isMatching){                
            res.status(201).render("home",{
                name:nameu
            });
        }else{
            res.send("invalid login");
        }
    }catch(error){
        res.status(400).send("invalid login");
    }
});



app.get("/home",auth,(req,res)=>{
    res.render("home");
});

app.get("/logout",auth,async(req,res)=>{
    console.log("logout");
    try{
        // req.usr.token = req.usr.token.filter((currentElement)=>{
        //     // console.log("logout");
        //     return currentElement.token !== req.token
        // })
        req.usr.tokens = [];
        res.clearCookie("jwt");
        console.log("Logout Successful");
        await req.usr.save();
        res.render("index");
    }catch(error){
        res.status(500).send(error);
    }
});

const createToken = async()=>{
    const token  = await jwt.sign({_id:"61e997e1cc0ba0932ed9ade5"},process.env.SECRET_KEY,{expiresIn:"20 seconds"});
        console.log(token);
    const userVer = await jwt.verify(token,process.env.SECRET_KEY);
    console.log(userVer);
}
createToken();

app.listen(port,()=>{
    console.log('Listening to port on http://localhost:3000');
})