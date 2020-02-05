const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        login: "1"
    })
});

module.exports = router;