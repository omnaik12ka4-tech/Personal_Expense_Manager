const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");

router.post("/register",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name||!email||!password) return res.status(400).json({message:"All fields are required"});
    if(password.length<6) return res.status(400).json({message:"Password must be at least 6 characters"});
    if(await User.findOne({email:email.toLowerCase()})) return res.status(409).json({message:"Email already registered"});
    const hash=await bcrypt.hash(password,10);
    const user=await User.create({name,email:email.toLowerCase(),password:hash});
    const token=jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWT_SECRET||"change_this_secret",{expiresIn:"7d"});
    res.status(201).json({token,user:{name:user.name,email:user.email}});
  }catch(e){res.status(500).json({message:e.message});}
});

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email:email?.toLowerCase()});
    if(!user || !(await bcrypt.compare(password||"",user.password))) return res.status(401).json({message:"Invalid email or password"});
    const token=jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWT_SECRET||"change_this_secret",{expiresIn:"7d"});
    res.json({token,user:{name:user.name,email:user.email}});
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;