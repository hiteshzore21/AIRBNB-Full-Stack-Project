const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema} = require("../schema");
const Review = require("../MODELS/review");
const Listing = require('../MODELS/listing');
const {isLogged, isReviewOwner} = require("../middleware");
const reviewController = require("../controllers/review");

const reviewValidate = (req, res, next) => {
    console.log("req.body is:", req.body);  
    let { error } = reviewSchema.validate(req.body);
    console.log("Joi error is:", error);    

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}
router.post('/', isLogged,  reviewValidate, wrapAsync (reviewController.reviewSubmit))

router.delete("/:reviewId",isLogged , isReviewOwner, wrapAsync(reviewController.reviewDelete))

module.exports = router;