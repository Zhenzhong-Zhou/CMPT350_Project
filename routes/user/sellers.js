const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Product = require("../../models/product");
const {isSeller} = require("../../config/auth");

/*
 * GET Sellers Route
 */
router.get("/", isSeller, async (req, res) => {
    const user = await User.findOne({username: req.user.username});
    const users = await User.find({admin: 2});
    const products = await Product.find({seller: user});
    res.render("user/sellers/index", {
        products: products,
        users: users,
        user: user,
        login: "1"
    })
});

/*
 * GET Seller's Page Route
 */
router.get("/:id", async (req, res) => {
    const products = await Product.find({seller: req.params.id}).populate("seller").exec();
    const product = await Product.findOne({seller: req.params.id}).populate("seller").exec();
    res.render("user/sellers/show", {
        login: "1",
        product: product,
        products: products
    })
});

module.exports = router;