const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    portraitImage: {
        type: Buffer
    },
    portraitImageType: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    }
});

userSchema.virtual("portraitPath").get(function () {
    if (this.portraitImage != null && this.portraitImageType != null) {
        return `data:${this.portraitImageType};charset=utf-8;base64,${this.portraitImage.toString("base64")}`
    }
});

const User = module.exports = mongoose.model("User", userSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = function (email, callback) {
    const query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
