const express = require("express");
const router = express.Router();
const Category = require("../../models/category");

/*
 * GET Sellers Route
 */
router.get("/", (req, res) => {
    res.render("user/markets/index", {
        login: "1"
    })
});

/*
 * GET New Seller Route
 */
router.get("/new", async (req, res) => {
    res.render("user/markets/new", {
        login: "2"
    })
});

/*
 * POST Create Product Route
 */
router.post("/", async (req, res) => {

});

module.exports = router;