const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { check, validationResult } = require('express-validator');

router.get("/", (req, res) => {
    res.render("register/sign_up", {login: "3"})
});

router.post("/", [
    check("username", "Username is required.").notEmpty(),
    check("email", "Email is required.").notEmpty(),
    check("email", "Email is not valid.").isEmail(),
    check("password", "Password is required.").notEmpty().isLength({min: 6}).exists(),
    check("password2", "Passwords do not match.").exists()
        .custom((value, { req }) => value === req.body.password),
],  (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    const user = new User({
        username: username,
        email: email,
        password: password,
        password2: password2
    });
    User.createUser(user, function (err, user) {
        if (err) throw err;
        console.log(user.username);
    });
    // const newUser = await user.save();
    req.flash("success_msg", "You are registered and can now login.");
    console.log(user.username);
    res.redirect("/login");
});

module.exports = router;