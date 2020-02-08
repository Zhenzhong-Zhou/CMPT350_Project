const express = require("express");
const router = express.Router();
const {isUser} = require("../config/auth");

router.get("/", isUser, (req, res) => {
    res.render("index", {
        user: req.user,
        login: "1"
    })
});

module.exports = router;