const express=require("express");
const { wrapAsync, isLogined } = require("../utils/middlewares");
const { default: axios } = require("axios");
const router=express.Router();
const {stringify}=require("flatted");

//get posts from a subreddit type=new/hot/top
router.get("/:subredditname/:type",isLogined,wrapAsync(async(req,res,next)=>{
    let {subredditname,type}=req.params;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/r/${subredditname}/${type}`,{headers});
    res.send(data.data);
}));

//search on the subreddit
router.get("/:subredditname/search",isLogined,wrapAsync(async(req,res,next)=>{
    let {subredditname}=req.params;
    let {query,sort="hot",after=null}=req.query;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/r/${subredditname}/search?q=${query}&sort=${sort}&after=${after}&restrict_sr=true`,{headers});
    res.send(data.data);
}));

//get information about the specific subreddit (where=banned/muted/wikibanned,contributors,wikicontributors,moderators)
router.get("/:subredditname/about/:where",isLogined,wrapAsync(async(req,res,next)=>{
    let {where,subredditname}=req.params;
    let headers={
        "Authorization":`Bearer ${req.session.access_token}`,
        'User-Agent': 'Chatrion'
    };
    const data=await axios.get(`https://oauth.reddit.com/r/${subredditname}/about/${where}`,{headers});
    res.send(data.data);
}));


module.exports=router;