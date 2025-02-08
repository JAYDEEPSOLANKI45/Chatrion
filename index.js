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
const QueryString = require("qs");
const {isLogined , wrapAsync}=require("./utils/middlewares");
const {stringify}=require("flatted");

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

// routes
const meRoutes=require("./routes/meRoutes");
const subredditRoutes=require("./routes/subredditRoutes");
const searchRoutes=require("./routes/searchRoutes");
app.use("/subreddit",subredditRoutes);
app.use("/me",meRoutes);
app.use("/search",searchRoutes);

app.get("/",(req,res)=>
{
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${process.env.CLIENTID}&response_type=code&state=${process.env.RANDOM}&redirect_uri=${process.env.REDIRECT_URI}&duration=permanent&scope=${process.env.SCOPE}`)
});


app.get("/redirect", async (req, res) => {
        const tokenResponse = await axios.post(
            "https://www.reddit.com/api/v1/access_token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: req.query.code,  // Use the received auth code
                redirect_uri: process.env.REDIRECT_URI
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${Buffer.from(`${process.env.CLIENTID}:${process.env.SECRET}`).toString('base64')}`,
                    "User-Agent": "Chatrion/1.0 by chatrion"
                }
            }
        );

        // Save access token in session
        req.session.access_token = tokenResponse.data.access_token;
        req.session.refresh_token = tokenResponse.data.refresh_token; // Store refresh token too

        console.log("Access Token:", req.session.access_token);

        // Redirect to the intended URL or default to /me
        const redirectUrl = req.session.redirectUrl || "/me";
        req.session.redirectUrl = undefined;
        res.redirect(redirectUrl);
});


app.get("/logout",(req,res)=>{
    req.session.authcode=undefined;
    res.send("Logout success") //redirect to the login page
});

app.listen(8080,(req,res)=>{
    console.log("Listening");
});