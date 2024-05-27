const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview=(req,res,next) => {
  let {error} =  reviewSchema.validate(req.body);
  
  if(error) {
    let errMsg = error .details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg.error);
}else{
  next();
}
};

router.post(
  "/",
  // validateReview, 
  wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); // You need to ensure that the Listing model is imported and available.
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("Success","new Review created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// delete review route
router.delete("/:reviewId",
// validateReview, 
wrapasync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Ensure that Listing is imported and available.
  await Review.findByIdAndDelete(reviewId);
  req.flash("Success","review Deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
