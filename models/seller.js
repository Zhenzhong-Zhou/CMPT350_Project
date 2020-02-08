const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sellerSchema = new mongoose.Schema({
    sellerName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    seller: {
        type: Number,
        required: true
    }
});

const Seller = module.exports = mongoose.model("Seller", sellerSchema);

module.exports.createSeller = function (newSeller, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newSeller.password, salt, function (err, hash) {
            newSeller.password = hash;
            newSeller.save(callback);
        });
    });
};

module.exports.getSellerByName = function (sellerName, callback) {
    const query = {sellerName: sellerName};
    Seller.findOne(query, callback);
};

module.exports.getSellerById = function (id, callback) {
    Seller.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
