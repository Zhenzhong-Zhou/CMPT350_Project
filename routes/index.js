const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        user: req.user,
        login: "1"
    })
});

module.exports = router;