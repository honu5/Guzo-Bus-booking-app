import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from "path";
import {Pool} from "pg"
import bcrypt from "bcrypt";
import { userProfile,routes,busStations,bookings } from "./Mock.js";
import { marked } from "marked";
import { getGeminiResponse, setLanguage, getLanguage } from "./utils/geminiWrapper.js";
import session from 'express-session';


let user="Busman"; // Change to "Busman" to simulate bus manager view


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

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

function initSessionData(req) {
  if (!req.session.topics) req.session.topics = [];
  if (!req.session.conversations) req.session.conversations = {};
}

app.set("views" , path.join(direName,"./views"))
app.set("view engine" , "ejs");

app.get("/",(req,res)=>{
    if (user=="user"){
        res.render("home")
    }
    else{
    res.render("Busman");
    }
})

app.get("/Ask", (req, res) => {
  initSessionData(req);
  res.render("askAi", { topics: req.session.topics });
});





app.post("/other", async (req, res) => {
  initSessionData(req);
  const message = req.body.user_input;

  let topicObj = req.session.topics.find(t => t.title === message.slice(0, 30));
  if (!topicObj) {
    topicObj = { id: Date.now(), title: message.slice(0, 30) };
    req.session.topics.push(topicObj);
    req.session.conversations[topicObj.id] = [];
  }

  const rresponse = await getGeminiResponse(message, req.session.conversations[topicObj.id]);
  const response = marked.parse(rresponse);

  req.session.conversations[topicObj.id].push({ message, response });

  res.redirect(`/other/${topicObj.id}`);
});

app.get("/other/:id", (req, res) => {
  initSessionData(req);
  const topicId = parseInt(req.params.id);
  res.render("other", { 
    ans: req.session.conversations[topicId] || [], 
    topics: req.session.topics, 
    topicId 
  });
});

app.post("/chat", async (req, res) => {
  initSessionData(req);
  const message = req.body.user_input;
  const topicId = parseInt(req.body.topic_id);

  if (!req.session.conversations[topicId]) req.session.conversations[topicId] = [];

  const rresponse = await getGeminiResponse(message, req.session.conversations[topicId]);
  const response = marked.parse(rresponse);

  req.session.conversations[topicId].push({ message, response });

  res.redirect(`/chat/${topicId}`);
});

app.get("/Ask", (req, res) => {
  initSessionData(req);
  res.render("askAi", { topics: req.session.topics });
});

app.get("/chat/:id", (req, res) => {
  initSessionData(req);
  const topicId = parseInt(req.params.id);
  res.render("other", { 
    ans: req.session.conversations[topicId] || [], 
    topics: req.session.topics, 
    topicId 
  });
});



app.post("/toggle-language", (req, res) => {
  const current = getLanguage();
  const newLang = current === "amharic" ? "english" : "amharic";
  setLanguage(newLang);
  res.json({ lang: newLang });
});








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
    res.render("busStations",{busStations})
})

app.get("/profile",(req,res)=>{
    res.render("profile",{user:userProfile})
})

app.get("/routes",(req,res)=>{
    res.render("routes",{routes})
})

app.get("/userBooking",(req,res)=>{
    res.render("userBooking",{bookings})
})

app.get("/comments",(req,res)=>{
    res.render("comment");
})

app.get("/Listing",(req,res)=>{
    res.render("Listing");
})

app.get("/MyBus",(req,res)=>{
    res.render("MyBus");
})

app.get("/post",(req,res)=>{
    // Build list of unique places from routes mock
    const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
    res.render("post", { places });
})

// Handle schedule post submissions
app.post("/post", (req, res) => {
    const { route, from, to, date, departure, price, reminder } = req.body;
    const computedRoute = route && route.trim() ? route.trim() : (from && to ? `${from} → ${to}` : "");
    // TODO: Save to DB. For now, just render success.
    // Basic presence check (server-side) – optional
    if (!computedRoute || !date || !departure || !price || !reminder) {
        const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
        return res.status(400).render("post", { success: false, error: "Please fill in all fields.", places });
    }
    // In a real implementation, insert into a schedules table here.
    const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
    res.render("post", { success: true, places });
});



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