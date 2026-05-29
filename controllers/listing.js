const Listing = require('../MODELS/listing');
const axios = require("axios");
const Booking = require("../MODELS/booking");
const mongoose = require("mongoose");


module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({})
     console.log("data shown")
    res.render("listings/index",{allListings});
}

module.exports.new = (req, res) => { 
    console.log(req.user); 
    res.render("listings/new");
}

module.exports.show = async(req,res)=>{

     let { id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id).populate({
   path: "reviews",
   populate: {
      path: "postedBy"
   }
}).populate("owner");


     console.log("geometry:", listing.geometry); 
    if(!listing){
        req.flash("error","Listing your searched does not exists");
        res.redirect("/listings");
    } else {
        res.render("listings/show",{listing});
    }
}

module.exports.edit = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}

module.exports.createListing = async(req,res,next)=>{
     let listing = req.body.listings;
    console.log(req.body.listings);

      let geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${listing.location}&format=json&limit=1`,
        {
            headers: {
                'User-Agent': 'WanderlustApp/1.0'
            }
        }
    );

    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = {filename, url}

    let newListings = new Listing(listing);
    newListings.owner = req.user._id;

     if(geoResponse.data.length > 0) {
        let { lat, lon } = geoResponse.data[0];
        newListings.geometry = {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        };
    }

    await newListings.save();
    req.flash("success","Listing Created Successfully");
    res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {

    let { location } = req.body.search;

    let searchedListings = await Listing.find({
        location: {
            $regex: location,
            $options: "i"
        }
    });
    res.render("listings/searchedListings", {
        searchedListings
    });
};

module.exports.bookListing = async(req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);

    console.log("Booked Listing is ",listing.title);
    req.flash("success","Listing Booked Successfully")
    res.redirect(`/listings/${id}`);
}

module.exports.confirmBooking = async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newBooking = new Booking(req.body.booking);
    newBooking.listing = listing._id;
    newBooking.user = req.user._id;

    newBooking.totalPrice = listing.price;

    await newBooking.save();
    console.log("Booking Saved:", newBooking);

    req.flash("success", "Booking Confirmed Successfully");

    res.redirect(`/listings/${listing._id}`);
}

module.exports.updateListing = async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(  id,
   {...req.body.listings});

   if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
   }
   req.flash("success","Listing Updated Successfully")
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}