const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Review = require("../../models/review");
const {isSeller, isUser} = require("../../config/auth");

/*
 * GET User's Profile Index Page Route
 */
router.get("/", async (req, res) => {
    const user = await User.findOne(req.user).exec();
    const reviews = await Review.find({user: user}).populate("product").exec();
    res.render("user/profiles/index", {
        user: user,
        reviews: reviews,
        login: "1"
    });
});

/*
 * GET User's Profile Index Page Route
 */
router.get("/user_information", async (req, res) => {
    const user = await User.findOne(req.user).exec();
    res.render("user/profiles/user_information", {
        user: user,
        login: "1"
    });
});

module.exports = router;