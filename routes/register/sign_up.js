const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { check, validationResult } = require('express-validator');

router.get("/", (req, res) => {
    res.render("register/sign_up", {login: "3"})
});

router.post("/", [
    check("username", "Username is required.").notEmpty(),
    check("email", "Email is required.").notEmpty(),
    check("email", "Email is not valid.").isEmail(),
    check("password", "Password is required.").notEmpty().exists(),
    check("password2", "Passwords do not match.").exists()
        .custom((value, { req }) => value === req.body.password),
],  (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    // const user = new User({
    //     username: username,
    //     email: email,
    //     password: password
    // });
    // user.createUser(user, function (err, user) {
    //     if (err) throw err;
    //     console.log(user);
    // });
    // // const newUser = await user.save();
    // req.flash("success_msg", "You are registered and can now login.");
    // console.log(user);
    // res.redirect("/login");
    // try {
    //     await user.createUser(user, function (err, user) {
    //         if (err) throw err;
    //         console.log(user);
    //     });
    //     // const newUser = await user.save();
    //     req.flash("success_msg", "You are registered and can now login.");
    //     console.log(user);
    //     res.redirect("/login");
    // }catch (e) {
    //     // validation
    //     const errorFormatter = ({location, msg, param}) => {
    //         return `${location}[${param}]: ${msg}`;
    //     };
    //     const results = validationResult(req).formatWith(errorFormatter);
    //     if (!results.isEmpty()) {
    //         res.render("register/sign_up", {
    //             results: results,
    //             login: "3"
    //         })
    //     }else {
    //         console.log("PASSED")
    //     }
    // }
    // validation
    // const errorFormatter = ({location, msg, param}) => {
    //     return `${location}[${param}]: ${msg}`;
    // };
    // const results = validationResult(req).formatWith(errorFormatter);
    // if (!results.isEmpty()) {
    //     res.render("register/sign_up", {
    //         results: results,
    //         login: "3"
    //     })
    // }else {
        const user = new User({
            username: username,
            email: email,
            password: password
        });
        User.createUser(user, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
        // const newUser = await user.save();
        req.flash("success_msg", "You are registered and can now login.");
        console.log(user);
        res.redirect("/login");
    // }
});

module.exports = router;