const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: String,
    email: String,
    phone: String,
    aadhar: String,

    checkIn: Date,
    checkOut: Date,

    guests: String,
    paymentMethod: String,
    address: String,
    request: String,

    totalPrice: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Booking", bookingSchema);