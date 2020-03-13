const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Review = require("../../models/review");
const Product = require("../../models/product");
const {isSeller, isUser} = require("../../config/auth");

/*
 * GET User's Profile Index Page Route
 */
router.get("/", async (req, res) => {
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    try {
        const user = await User.findOne(req.user).exec();
        const reviews = await Review.find({user: user}).populate("product").exec();
        const products = await query.exec();
        res.render("user/profiles/index", {
            user: user,
            reviews: reviews,
            products: products,
            searchOptions: req.query,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET User's Profile Index Page Route
 */
router.get("/user_information", async (req, res) => {
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    try {
        const user = await User.findOne(req.user).exec();
        const products = await query.exec();
        res.render("user/profiles/user_information", {
            user: user,
            products: products,
            searchOptions: req.query,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

module.exports = router;