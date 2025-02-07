module.exports.isLogined = function (req, res, next) {
    if (req.session.access_token) {
        return next();
    } else {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.originalUrl);
        return res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${process.env.CLIENTID}&response_type=code&state=${process.env.RANDOM}&redirect_uri=${process.env.REDIRECT_URI}&duration=permanent&scope=${process.env.SCOPE}`);
    }
}

module.exports.wrapAsync=function(fun){
    return async function(req,res,next)
    {
        fun(req,res,next).catch(next);
    }
}