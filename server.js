import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from "path";
import {Pool} from "pg"
import bcrypt from "bcrypt";
import { userProfile,routes,busStations,bookings, comments } from "./Mock.js";
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

// In-memory schedules (mock). In production use DB.
const schedules = [];

function normalizeSchedule(input){
    const id = Date.now();
    const seatsTotal = 40; // default capacity
    const seatsLeft = typeof input.seatsLeft === 'number' ? input.seatsLeft : seatsTotal; 
        return {
        id,
        route: input.route,
        date: input.date,
        departure: input.departure,
        price: Number(input.price),
        reminder: input.reminder,
        seatsLeft,
        seatsTotal,
            status: seatsLeft <= 0 ? 'closed' : 'active',
            closedReason: seatsLeft <= 0 ? 'auto' : undefined,
        createdAt: new Date()
    };
}

app.get("/",(req,res)=>{
    if (user==="user"){
        const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
        res.render("home", { places });
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
    const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
    res.render("home", { places })
})

app.get("/user",(req,res)=>{
    const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
    res.render("home", { places })
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
    res.render("comment", { comments });
})

app.get("/Listing",(req,res)=>{
        // Auto-close any active schedules that ran out of seats
        for (const s of schedules) {
            if (s.status === 'active' && s.seatsLeft <= 0) {
                s.status = 'closed';
                s.closedReason = 'auto';
            }
        }
        // Group schedules into active and past (closed or old date)
        const now = new Date();
        const today = new Date(now.toDateString());
        const active = schedules.filter(s => s.status === 'active' && new Date(s.date) >= today);
        const past = schedules.filter(s => s.status !== 'active' || new Date(s.date) < today);
        res.render("Listing", { active, past });
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
        if (!computedRoute || !date || !departure || !price || !reminder) {
                const places = Array.from(new Set(routes.flatMap(r => [r.from, r.to]))).sort();
                return res.status(400).render("post", { success: false, error: "Please fill in all fields.", places });
        }
        const sched = normalizeSchedule({ route: computedRoute, date, departure, price, reminder });
        schedules.unshift(sched);
        // Redirect to listings to show the new bus
        res.redirect("/Listing");
});

// Close an active schedule by id
app.post('/Listing/:id/close', (req, res) => {
    const id = Number(req.params.id);
    const idx = schedules.findIndex(s => s.id === id);
    if (idx !== -1) {
        schedules[idx].status = 'closed';
        schedules[idx].closedReason = 'manual';
    }
    res.redirect('/Listing');
});

// Delete a past/closed schedule by id
app.post('/Listing/:id/delete', (req, res) => {
    const id = Number(req.params.id);
    const idx = schedules.findIndex(s => s.id === id);
    if (idx !== -1) schedules.splice(idx, 1);
    res.redirect('/Listing');
});

// Re-open a manually closed schedule (only if seats are available)
app.post('/Listing/:id/reopen', (req, res) => {
    const id = Number(req.params.id);
    const s = schedules.find(s => s.id === id);
    if (s && s.status === 'closed' && s.closedReason === 'manual' && s.seatsLeft > 0) {
        s.status = 'active';
        s.closedReason = undefined;
    }
    res.redirect('/Listing');
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