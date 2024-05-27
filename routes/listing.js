const express = require('express');
const router=express.Router();
const wrapasync = require("../utils/wrapasync.js");
const{listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing=(req,res,next) => {
    let {error} =  listingSchema.validate(req.body);
    
    if(error) {
      let errMsg = error .details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg.error);
  }else{
    next();
  }
};
//Index Route
router.get("/", wrapasync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapasync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","lisitng does not exists");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/",
  // validateListing,
  wrapasync(async (req, res) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("Success","New Listing created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",  wrapasync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id",
// validateListing, 
wrapasync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapasync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("Success","Listing Deleted!");
  console.log(deletedListing);
  res.redirect("/listings");
}));

module.exports=router;