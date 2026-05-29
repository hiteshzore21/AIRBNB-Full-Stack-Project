const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
     image: {
        filename: String,
        url: {
            type: String,
            default: "https://www.indianluxurytrains.com/blog/top-luxury-hotels-in-india",
            set: (v) => v === "" ? "https://www.indianluxurytrains.com/blog/top-luxury-hotels-in-india" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
      category: {
        type: String,
        enum: [
            "Mountain",
            "Beach",
            "Farm",
            "Arctic",
            "Camping",
            "Desert",
            "Forest",
            "Lake",
            "Temple",
            "City",
            "Rooms"
        ],
        required: true
    },
    reviews: [
        { 
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    }
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews.length > 0) {
        const Review = require("./review");
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log("Associated reviews deleted");
    }
});

const Listing =  mongoose.model("Listing",listingSchema);

module.exports = Listing;