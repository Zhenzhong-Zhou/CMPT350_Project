const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    reply: {
        type: String,
        required: true
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Review"
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Reply", replySchema);