const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const {forwardAuthenticated} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

router.get("/", (req, res) => {
    res.render("register/sign_up", {login: "3"})
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
        return res.render("register/sign_up", {
            errorMessage: result.array(),
            login: "3"
        });
    }

    const user = new User({
        username: username,
        email: email,
        password: password,
        admin: 0
    });
    User.createUser(user, function (err) {
        if (err) throw err;
    });
    req.flash("success_msg", "You are registered and can now login.");
    res.redirect("/user/login");
});

module.exports = router;