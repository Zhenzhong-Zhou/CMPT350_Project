const express = require("express");
const router = express.Router();
const Seller = require("../../models/user");
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];
const { check, validationResult } = require('express-validator');

/*
 * GET All Sellers Route
 */
router.get("/", async (req, res) => {
    try {
        const sellers = await Seller.find({admin: 2}).exec();
        res.render("admin/sellers/index", {
            sellers: sellers,
            login: "2"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Seller's Page Route
 */
router.get("/:id", async (req, res) => {
    const seller = await Seller.findById(req.params.id).exec();
    const products = await Product.find({seller: req.params.id}).populate("category").populate("seller").exec();
    res.render("admin/sellers/show", {
        seller: seller,
        products: products,
        login: "2"
    });
});

/*
 * GET Seller's Products Route
 */
router.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category").populate("seller").exec();
    res.render("admin/sellers/product", {
        product: product,
        login: "2"
    });
});

module.exports = router;