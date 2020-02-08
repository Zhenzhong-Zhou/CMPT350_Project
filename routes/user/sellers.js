const express = require("express");
const router = express.Router();
const {isUser} = require("../../config/auth");
const Category = require("../../models/category");

/*
 * GET Sellers Route
 */
router.get("/", isUser, (req, res) => {
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
    res.send("Not finished Yet")
});

module.exports = router;