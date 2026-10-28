require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budget");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);

app.get("/api/health", (req,res)=>res.json({ok:true, message:"Expense Manager API running"}));

app.get("*", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/expense_manager")
  .then(()=>app.listen(PORT, ()=>console.log(`Server running: http://localhost:${PORT}`)))
  .catch(err=>{ console.error("MongoDB connection failed:", err.message); process.exit(1); });
