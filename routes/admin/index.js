const express = require("express");
const router = express.Router();
const Page =  require("../../models/page");
const Category = require("../../models/category");
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");

router.get("/", isAdmin, async (req, res) => {
    let pages;
    let categories;
    let products;
    try {
        pages = await Page.find().sort({sorting: 1}).limit(10).exec();
        categories = await Category.find({}).limit(10).exec();
        products = await Product.find().sort({createdAt: "desc"}).limit(10).exec()
    }catch (e) {
        products = [];
    }
    res.render("admin/index", {
        pages: pages,
        categories: categories,
        products: products,
        login: "2"
    })
});

module.exports = router;