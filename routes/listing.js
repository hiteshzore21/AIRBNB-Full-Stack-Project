const express = require("express");
const router = express.Router();
const Listing = require('../MODELS/listing');
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema, reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const {isLogged, isOwner} = require("../middleware");
const ListingControler = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({ storage})
const Booking = require("../MODELS/booking");


const listingValidate = (req,res,next)=>{
  let { error } = listingSchema.validate(req.body, { allowUnknown: true });

   if(error){
     throw new ExpressError(400,error.details[0].message);
   }else{
     next();
   }
}

router.get('/new', isLogged ,ListingControler.new);


router.get('/',wrapAsync (ListingControler.index))

router.get("/:id/listingBooked",isLogged, async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  res.render("listings/booking",{listing});
});

router.get("/:id/payment", isLogged, async(req,res)=>{

    let listing = await Listing.findById(req.params.id);

    res.render("listings/payment", {listing});
});


router.get("/bookings", isLogged, async(req,res)=>{

    let bookings = await Booking.find({
        user: req.user._id
    }).populate("listing");

    res.render("listings/customerBooking", { bookings });
});

router.post(
    "/:id/confirmBooking",
    isLogged,
    wrapAsync(ListingControler.confirmBooking)
);

router.post("/:id/paymentSuccess", isLogged, (req,res)=>{

    req.flash("success","Payment Successful & Booking Confirmed");

    res.redirect(`/listings/${req.params.id}`);
});

router.get('/:id',  wrapAsync (ListingControler.show))

router.post("/searchedListings", ListingControler.searchListings);

router.get('/:id/edit',isLogged, isOwner , wrapAsync (ListingControler.edit ))

router.post("/:id/confirmBooking", isLogged, (req,res)=>{

    console.log(req.body.booking);

    req.flash("success","Booking Details Saved");

    res.redirect(`/listings/${req.params.id}/payment`);
});


router.post('/',isLogged, upload.single('image'),  listingValidate, wrapAsync(ListingControler.createListing))


router.put('/:id', isLogged , isOwner ,listingValidate, upload.single('image'), wrapAsync (ListingControler.updateListing))

router.delete('/:id',isLogged, isOwner ,wrapAsync( ListingControler.deleteListing)) 
module.exports = router;