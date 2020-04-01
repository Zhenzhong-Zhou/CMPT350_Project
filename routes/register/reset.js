const express = require("express");
const router = express.Router();
const User = require("../../models/user");

/*
 * GET Reset Index Page Route
 */
router.get("/", async (req, res) => {
    let query = User.findOne({email: req.body.email});
    let email_input = req.query.email;
    if (email_input != null && email_input !== "") {
        query = query.regex("email", email_input);
    }
    const email = await query.exec();
    res.render("register/reset", {
        searchOptions: req.query,
        email: email,
        login: "3"
    });
});

/*
 * PUT Reset User's Account Route
 */
router.put("/", async (req, res) => {
    let user;
    user = await User.findById(req.body.email_id);
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    User.createUser(user, function (err) {
        if (err) throw err;
    });
    await user.save();
    res.redirect("/user/login");
});

module.exports = router;