const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

router.get("/", (req, res) => {
    res.render("register/sign_up", {login: "3"})
});

router.post("/", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        req.session.login = "1";        // after registering successfully, write into session
        req.session.username = username;
        await user.save();
        res.redirect("/login");
    }catch (e) {
        console.log(e);
        res.redirect("/sign_up", {
            user: user,
            errorMessages: "Sign up not successfully"
        });
    }
});

module.exports = router;