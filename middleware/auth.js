const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Regmail = require("../models/regmail");
const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"mynameiskunalagarwalwebdeveloper");
        console.log(verifyUser);
        const usr = await Regmail.findOne({_id:verifyUser._id});
        console.log(usr);

        req.token = token;
        req.usr = usr;
        next();
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;