const express=require("express");
const { wrapAsync, isLogined } = require("../utils/middlewares");
const { default: axios } = require("axios");
const router=express.Router();
const {stringify}=require("flatted");

// /search?query=cats&sort=top&after=(fullname of the last item (used for pagination))&type=(sr, link, user)
router.get("/",isLogined,wrapAsync(async(req,res,next)=>{
    let {query,sort="hot",after=null,type="sr"}=req.query;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/search?q=${query}&sort=${sort}&after=${after}&type=${type}`,{headers});
    res.send(data.data);
}));

// search for reddit names (list of names) that begins with the query string
router.get("/subreddit_names",isLogined,wrapAsync(async(req,res,next)=>{
    let {query}=req.query;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/api/search_reddit_names?query=${query}&include_over_18=false&exact=false`,{headers});
    res.send(data.data);
}));

//search for detailed subreddit information
router.get("/subreddit_info",isLogined,wrapAsync(async(req,res,next)=>{
    let {query}=req.query;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const body = `query=${query}&include_over_18=false&exact=false`;
    const data=await axios.post(`https://oauth.reddit.com/api/search_subreddits`,body,{headers});
    res.send(data.data);
}));

module.exports=router;