const express=require("express");
const { wrapAsync, isLogined } = require("../utils/middlewares");
const { default: axios } = require("axios");
const router=express.Router();
const {stringify}=require("flatted");

router.get("/",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me",{headers});
    res.send(data.data);
}))

router.get("/karma",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me/karma",{headers});
    res.send(data.data);
}));

router.get("/trophies",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me/trophies",{headers});
    res.send(data.data);
}));

router.get("/friends",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me/friends",{headers});
    res.send(data.data);
}));

router.get("/blocked",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me/blocked",{headers});
    res.send(data.data);
}));

router.get("/karma",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get("https://oauth.reddit.com/api/v1/me/karma",{headers});
    res.send(data.data);
}));

router.get("/subreddit/:where",isLogined,wrapAsync(async(req,res,next)=>{
    const headers = {
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/subreddits/mine/${req.params.where}`,{headers});
    res.send(data.data);
}));


module.exports=router;