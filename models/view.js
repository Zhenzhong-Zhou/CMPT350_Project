const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
    views: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("View", viewSchema);