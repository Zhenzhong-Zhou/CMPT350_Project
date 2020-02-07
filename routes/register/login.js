const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");

router.get("/", (req, res) => {
    if (res.locals.user) res.redirect("/");
    res.render("register/login", {login: "3"});
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) return done(null ,false, {message: "Unknown User"});
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user)
                }else {
                    return done(null, false, {message: "Invalid password"})
                }
            })
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, function (err, user) {
        done(err, user);
    })
});

router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true,
}), (req, res) => {
    res.redirect("/")
});

// logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out.");
    res.redirect("/login");
});

module.exports = router;