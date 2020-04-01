const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { check, validationResult } = require('express-validator');
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];

router.get("/", (req, res) => {
    res.render("register/seller_sign_up", {login: "3"})
});

router.post("/", [
    check("username", "Username is required.").notEmpty(),
    check("email", "Email is required.").notEmpty(),
    check("email", "Email is not valid.").isEmail(),
    check("password", "Password must have at least 6 characters.").notEmpty().isLength({min: 6}).exists(),
    check("password2", "Passwords do not match.").exists()
        .custom((value, { req }) => value === req.body.password),
], async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const errorFormatter = ({msg}) => {
        return `${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        return res.render("register/seller_sign_up", {
            errorMessage: result.array(),
            login: "3"
        });
    }
    const user = new User({
        username: username,
        email: email,
        gender: req.body.gender,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: password,
        admin: 2,
    });
    savePortrait(user, req.body.portrait);
    User.createUser(user, function (err) {
        if (err) throw err;
    });
    req.flash("success_msg", "You are registered and can now login.");
    res.redirect("/user/login");
});

function savePortrait(user, portraitEncoded) {
    if (portraitEncoded == null) return;
    const portrait = JSON.parse(portraitEncoded);
    if (portrait != null && imageMimeTypes.includes(portrait.type)) {
        user.portraitImage = new Buffer.from(portrait.data, "base64");
        user.portraitImageType = portrait.type;
    }
}

module.exports = router;