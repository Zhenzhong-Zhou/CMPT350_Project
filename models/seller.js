const mongoose = require("mongoose");

const portraitBasePath = "upload/portrait";

const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    portrait: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    seller: {
        type: Number
    }
});

module.exports = mongoose.model("Seller", sellerSchema);
module.exports.portraitBasePath = portraitBasePath;