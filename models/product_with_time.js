const mongoose = require("mongoose");

const product_timeSchema = new mongoose.Schema({
    product_timeName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Product", product_timeSchema);