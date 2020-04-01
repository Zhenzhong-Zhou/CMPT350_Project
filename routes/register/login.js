const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");

router.get("/", async (req, res) => {
    try {
        if (res.locals.user) res.redirect("/");
        res.render("register/login", {
            login: "3"
        });
    }catch (e) {
        res.redirect("/");
    }
});

router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "login",
        failureFlash: true,
    })(req, res, next);
});

module.exports = router;