const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = "mongodb+srv://anup:12345@cluster0.u4i8vln.mongodb.net/wanderlust";

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStratergy=require("passport-local");
const User=require("./models/user.js");

main()
  .then(() => {
    console.log("connected to WanderlustDatabase!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
  secret:"supersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7*24*60*60 *1000,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am root- This is the basic connection to our webpage");
});

app.use(session(sessionOptions));
app.use(flash());




app.use((req,res,next)=>{
     res.locals.success=req.flash("Success");
     res.locals.error=req.flash("error");
     next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("*", (req, res,next) => {
  next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next) => {
  let{statusCode=500,message="Something Went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
