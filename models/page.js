const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    pageTitle: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
});

module.exports = mongoose.model("Page", pageSchema);