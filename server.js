import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from "path";
import {Pool} from "pg"
import bcrypt from "bcrypt";

const app=express()
const port=3000;
const _filePath=fileURLToPath(import.meta.url);
const direName=dirname(_filePath);
const saltRound=10;

const pool=new Pool({
    user :"postgres",
    host:"localhost",
    database:"Bus_Booking",
    password:"Lir@7Lir@7",
    port:5432
})

try{
    pool.connect()
        .then(()=>console.log("connected succesfully"));
}catch(err){
    console.log("Error connecting to the database", err);
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(direName,"./public")))

app.set("views" , path.join(direName,"./views"))
app.set("view engine" , "ejs");

app.get("/",(req,res)=>{
    res.render("landing");
})

app.get("/signUp",(req,res)=>{
    res.sendFile(path.join(direName,"public","signUp.html"));
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(direName,"public","Login.html"));
})

app.get("/home",(req,res)=>{
    res.render("home")
})

app.get("/user",(req,res)=>{
    res.render("home")
})

app.get("/notifications",(req,res)=>{
    res.render("notifications")
})

app.get("/about",(req,res)=>{
    res.render("about")
})

app.get("/Ask",(req,res)=>{
    res.render("askAi")
})

app.get("/availableBuses",(req,res)=>{
    res.render("availableBuses")
})

app.get("/busStations",(req,res)=>{
    res.render("busStations")
})

app.get("/profile",(req,res)=>{
    res.render("profile")
})

app.get("/routes",(req,res)=>{
    res.render("routes")
})

app.get("/userBooking",(req,res)=>{
    res.render("userBooking")
})

app.get("/logout",(req,res)=>{
    res.sendFile(path.join(direName,"public","Login.html"));
})

app.post("/signUp",async (req,res)=>{
    const {name,email,password,confirm_password}=req.body;

    if(password!=confirm_password){
        return res.status(400).json({message:"password does not match"})
    }

    try{
        const hashedPassword=await bcrypt.hash(password,saltRound);
        const result=await pool.query("Insert into USERS (user_name,email,password_hash) values ($1,$2,$3) returning *",[name,email,hashedPassword]);
    
    res.render("home",{message:"You signed up successfully enjoy Guzo"})
    console.log("user registered succesfully")
    }catch(err){
        console.log("Error registering user", err);
        res.status(500).json({message:"Database error"});
    }
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    try{
        const result=await pool.query(
            "select * from USERS where email=$1",[email]
        )

        const user=result.rows[0];
        if (!user){
            console.log("user not found")
            return res.status(400).json({message:"user not found"});            
        }

        const match=await bcrypt.compare(password,user.password_hash);
        if (!match){
           console.log("invalid password")
           return res.status(400).json({message:"invalid password"})
        }

        res.redirect("/user")
    }catch(error){
        console.log("error while logging in",error)
        res.status(500).json({message:"Database error"})
    }
})

app.listen(port,()=>{
    console.log(`the server is running at port http://localhost:${port}`)
})