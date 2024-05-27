const express=require("express");
const app = express();
const users=require("./routes/user.js");
const posts= require("./routes/post.js");
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const session=require("express-session");
const path=require("path");

app.use(cookieParser("secretcode"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions={
    secret:"secretcode",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let{name ="anonymous"}=req.query;
    req.session.name=name;
   
    if(name === "anonymous"){
    req.flash("error", "user not registered");
    }else{
        req.flash("success", "user registered succesfully");
    }
    res.redirect("/hello");
});

app.get("/hello", (req,res)=>{
    res.render("page.ejs",{name:express.session.name, msg:req.flash("Success")});
});

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verify cookie sent");
// });

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi,${name}`);
// });

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, i am root!");
});

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("Server is listening to the port 3000");
});