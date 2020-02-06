const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

router.get("/", (req, res) => {
    if (res.locals.user) res.redirect("/");
    res.render("register/login", {login: "3"});
});

router.post("/", (req, res) => {

});

module.exports = router;