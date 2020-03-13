const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const Review = require("../../models/review");
const Reply = require("../../models/reply");
const View = require("../../models/view");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET All Products Route
 */
router.get("/", async (req, res) => {
    const views = new View({
        views: req.session.views++
    });
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    await views.save();
    const page_views = await View.find({}).countDocuments();
    const products = await query.exec();
    Product.find((err, all_products) => {
        if (err) console.log(err);
        res.render("user/products/all_products", {
            title: "All Products",
            all_products: all_products,
            products: products,
            searchOptions: req.query,
            views: page_views,
            login: "1"
        });
    });
});

/*
 * GET Products By Categories Route
 */
router.get("/:category", async (req, res) => {
    const views = new View({
        views: req.session.views++
    });
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    const categorySlug = req.params.category;
    try {
        await views.save();
        const page_views = await View.find({}).countDocuments();
        const category = await Category.findOne({slug: categorySlug});
        const category_products = await Product.find({category: category._id}).exec();
        const products = await query.exec();
        res.render("user/products/category_products", {
            title: category.categoryName,
            category_products: category_products,
            products: products,
            searchOptions: req.query,
            views: page_views,
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
    const views = new View({
        views: req.session.views++
    });
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
        await views.save();
        const page_views = await View.find({}).countDocuments();
        const products = await query.exec();
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
            products: products,
            searchOptions: req.query,
            views: page_views,
            login: "1"
        })
    }catch (e) {
        res.redirect("/");
    }
});

module.exports = router;