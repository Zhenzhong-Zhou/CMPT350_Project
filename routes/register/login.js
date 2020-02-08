const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const { forwardAuthenticated } = require("../../config/auth");

router.get("/", forwardAuthenticated, (req, res) => {
    if (res.locals.user) res.redirect("/");
    res.render("register/login", {login: "3"});
});

router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "login",
        failureFlash: true,
    })(req, res, next);
});

module.exports = router;