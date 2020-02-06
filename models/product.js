const mongoose = require("mongoose");

const coverImageBasePath = "upload/productCovers";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date
    },
    pageCount: {
        type: Number
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    }
});

module.exports = mongoose.model("Product", productSchema);
module.exports.coverImageBasePath = coverImageBasePath;