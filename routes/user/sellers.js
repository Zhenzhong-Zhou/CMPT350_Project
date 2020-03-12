const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Product = require("../../models/product");
const {isSeller} = require("../../config/auth");

/*
 * GET Sellers Route
 */
router.get("/", isSeller, async (req, res) => {
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
        const user = await User.findOne({username: req.user.username});
        const users = await User.find({admin: 2});
        const seller_products = await Product.find({seller: user});
        const products = await query.exec();
        res.render("user/sellers/index", {
            seller_products: seller_products,
            products: products,
            searchOptions: req.query,
            users: users,
            login: "1"
        });
    }catch (e) {
        res.redirect("/")
    }
});

/*
 * GET Seller's Page Route
 */
router.get("/:id", async (req, res) => {
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
        const seller_products = await Product.find({seller: req.params.id}).populate("seller").exec();
        const product = await Product.findOne({seller: req.params.id}).populate("seller").exec();
        const products = await query.exec();
        res.render("user/sellers/show", {
            product: product,
            seller_products: seller_products,
            products: products,
            searchOptions: req.query,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

module.exports = router;