const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET All Products Route
 */
router.get("/", (req, res) => {
    Product.find((err, products) => {
        if (err) console.log(err);
        res.render("user/products/all_products", {
            title: "All products",
            products: products,
            login: "1"
        });
    });
});

/*
 * GET Products By Categories Route
 */
router.get("/:category", (req, res) => {
    const categorySlug = req.params.category;
    Category.findOne({slug: categorySlug}, (err, category) => {
       Product.find({categoryName: categorySlug}, (err, products) => {
            if (err) console.log(err);
            res.render("user/products/category_products", {
                title: category.categoryName,
                products: products,
                login: "1"
            });
        });
    });
});

module.exports = router;