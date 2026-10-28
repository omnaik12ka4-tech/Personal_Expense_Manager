const router=require("express").Router();
const Budget=require("../models/Budget");
const auth=require("../middleware/auth");

router.get("/:month",auth,async(req,res)=>{
  const b=await Budget.findOne({userId:req.user.id,month:req.params.month});
  res.json(b||{month:req.params.month,amount:0});
});
router.post("/",auth,async(req,res)=>{
  try{
    const {month,amount}=req.body;
    const b=await Budget.findOneAndUpdate({userId:req.user.id,month},{amount:Number(amount)},{new:true,upsert:true,setDefaultsOnInsert:true});
    res.json(b);
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;