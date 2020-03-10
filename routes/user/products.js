const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const Review = require("../../models/review");
const Reply = require("../../models/reply");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET All Products Route
 */
router.get("/", (req, res) => {
    Product.find((err, products) => {
        if (err) console.log(err);
        res.render("user/products/all_products", {
            title: "All Products",
            products: products,
            login: "1"
        });
    });
});

/*
 * GET Products By Categories Route
 */
router.get("/:category", async (req, res) => {
    const categorySlug = req.params.category;
    try {
        const category = await Category.findOne({slug: categorySlug});
        const products = await Product.find({category: category._id}).exec();
        res.render("user/products/category_products", {
            title: category.categoryName,
            products: products,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Products By Categories Route
 */
router.get("/:category/:product", async (req, res) => {
    try {
        const product = await Product.findOne({slug: req.params.product}).populate("category").populate("seller").exec();
        const reviews = await Review.find({product: product}).populate("user").exec();
        const number = await Review.find({product: product}).countDocuments();
        const review = await Review.findOne({product: product}).populate("user").exec();
        const replies =  await Reply.find({review: review}).populate("review").populate("user").exec();
        res.render("user/products/product", {
            product: product,
            reviews: reviews,
            number: number,
            replies: replies,
            login: "1"
        })
    }catch (e) {
        res.redirect("/");
    }
});

module.exports = router;