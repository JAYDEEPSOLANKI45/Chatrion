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
app.use(methodOverride("_method"));

