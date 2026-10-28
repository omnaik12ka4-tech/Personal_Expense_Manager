const router=require("express").Router();
const Transaction=require("../models/Transaction");
const auth=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
  try{res.json(await Transaction.find({userId:req.user.id}).sort({date:-1,createdAt:-1}));}
  catch(e){res.status(500).json({message:e.message});}
});
router.post("/",auth,async(req,res)=>{
  try{
    const {type,amount,category,description,date}=req.body;
    if(!["income","expense"].includes(type)||!amount||!category||!date) return res.status(400).json({message:"Invalid transaction data"});
    res.status(201).json(await Transaction.create({userId:req.user.id,type,amount:Number(amount),category,description,date}));
  }catch(e){res.status(500).json({message:e.message});}
});
router.put("/:id",auth,async(req,res)=>{
  try{
    const t=await Transaction.findOneAndUpdate({_id:req.params.id,userId:req.user.id},req.body,{new:true,runValidators:true});
    if(!t)return res.status(404).json({message:"Transaction not found"});
    res.json(t);
  }catch(e){res.status(500).json({message:e.message});}
});
router.delete("/:id",auth,async(req,res)=>{
  try{
    const t=await Transaction.findOneAndDelete({_id:req.params.id,userId:req.user.id});
    if(!t)return res.status(404).json({message:"Transaction not found"});
    res.json({message:"Deleted"});
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;