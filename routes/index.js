const express = require("express");
const router = express.Router();
const {isUser} = require("../config/auth");

router.get("/", (req, res) => {
    const views = req.session.views++;
    res.render("index", {
        user: req.user,
        views: views,
        login: "1"
    })
});

module.exports = router;