const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model("Cart", cartSchema);