import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from "path";


const app=express()
const port=3000;
const _filePath=fileURLToPath(import.meta.url);
const direName=dirname(_filePath);

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

app.listen(port,()=>{
    console.log(`the server is running at port http://localhost:${port}`)
})