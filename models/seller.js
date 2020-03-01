const mongoose = require("mongoose");

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
    portraitImage: {
        type: Buffer,
        required: true
    },
    portraitImageType: {
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

sellerSchema.virtual("portraitPath").get(function () {
    if (this.portraitImage != null && this.portraitImageType != null) {
        return `data:${this.portraitImageType};charset=utf-8;base64,${this.portraitImage.toString("base64")}`
    }
});

module.exports = mongoose.model("Seller", sellerSchema);