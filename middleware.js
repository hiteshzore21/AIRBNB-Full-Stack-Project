const Listing = require('./MODELS/listing');
const Review = require("./MODELS/review");

module.exports.isLogged = (req,res,next)=>{
    if(!req.isAuthenticated()){
        
        if(req.originalUrl.includes("/listingBooked")){
            req.session.redirectUrl = req.originalUrl;
        }
        else if(req.originalUrl.includes("/reviews")){
            req.session.redirectUrl = `/listings/${req.params.id}`;
        } else {
            req.session.redirectUrl = req.originalUrl;
        }

         req.flash("error","You must be logged in");

        return res.redirect("/login");

    }
    next();
}

module.exports.SaveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
          req.flash("error", "You don't have permission to do this");
            return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async(req,res,next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!req.user._id.equals(review.postedBy._id)){
        req.flash("error","You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    next();
}