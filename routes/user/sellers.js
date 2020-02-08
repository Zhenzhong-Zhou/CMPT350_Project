const express = require("express");
const router = express.Router();

/*
 * GET Sellers Route
 */
router.get("/", (req, res) => {
    res.render("user/markets/index", {
        login: "1"
    })
});

/*
 * GET seller page
 */
router.get("/new", (req, res) => {
    res.render("user/markets/new", {
        login: "1"
    })
});

module.exports = router;