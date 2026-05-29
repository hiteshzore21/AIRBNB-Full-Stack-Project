const Listing = require("../MODELS/listing");
const Review = require("../MODELS/review");

module.exports.reviewSubmit = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

   listing.reviews.push(newReview); 
   newReview.postedBy = req.user._id;

   await newReview.save();
    await listing.save();
    req.flash("success","Review Added");
    console.log(req.user);
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.reviewDelete = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}