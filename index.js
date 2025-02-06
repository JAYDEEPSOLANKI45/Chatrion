const express=require("express")
const session=require("express-session")
const app=express()
const dotenv=require("dotenv")
dotenv.config()
const axios=require("axios")
const path=require("path")
const mongoStore=require("connect-mongo")
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const QueryString = require("qs")
const exp = require("constants")
app.use(methodOverride("_method"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:3600 * 1000,
        httpOnly: true
    },
    store:mongoStore.create({
        crypto:process.env.SECRET,
        mongoUrl:process.env.MONGODB_URI,
        touchAfter:3600
    })
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))
async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}
main().then(()=>console.log("Connected")).catch(()=>console.log("Error occured while connecting with the mongodb cluster"));

app.get("/",(req,res)=>
{
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${process.env.CLIENTID}&response_type=code&state=${process.env.RANDOM}&redirect_uri=${process.env.REDIRECT_URI}&duration=permanent&scope=${process.env.SCOPE}`)
})

app.get("/redirect",(req,res)=>{
    req.session.authcode=req.query.code;
    res.send(req.query.code);
})

app.listen(8080,(req,res)=>{
    console.log("Listening");
})