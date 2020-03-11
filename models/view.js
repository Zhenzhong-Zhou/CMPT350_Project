const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
    views: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("View", viewSchema);