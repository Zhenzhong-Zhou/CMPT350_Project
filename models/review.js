const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);