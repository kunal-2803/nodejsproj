const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mailerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:false
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

mailerSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        // console.log(token);
        return token;
    }
    catch(error){
        res.send("Error part is "+error);
        console.log("Error part is "+error);
    }
}

mailerSchema.pre("save",async function(next){

    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

    //create collection
const Regmail = new mongoose.model("Regmail",mailerSchema);



module.exports = Regmail;