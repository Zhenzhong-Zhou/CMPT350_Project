const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET All Products Route
 */
router.get("/", (req, res) => {
    console.log("111");
    // res.send("hello")
    // res.render("user/index")
    // res.render("index")
    Product.find((err, products) => {
        if (err) console.log(err);
        res.render("user/products/all_products", {
            title: "All products",
            products: products,
            login: "1"
        })
    })
});

module.exports = router;