const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const Product = require("../models/product");
const View = require("../models/view");
const {isUser} = require("../config/auth");

/*
 * GET user side page index
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
    try {
        await views.save();
        const page_views = await View.find({}).countDocuments();
        const products = await query.exec();
        const page = await Page.findOne({slug: "home"}).exec();
        res.render("index", {
            title: page.pageTitle,
            content: page.content,
            products: products,
            searchOptions: req.query,
            user: req.user,
            views: page_views,
            login: "1"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET user side page content
 */
router.get("/:slug", async (req, res) => {
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
    const slug = req.params.slug;
    try {
        await views.save();
        const page_views = await View.find({}).countDocuments();
        const products = await query.exec();
        const page = await Page.findOne({slug: slug}).exec();
        if (!page) {
            res.redirect("/");
        }else {
            res.render("index", {
                title: page.pageTitle,
                content: page.content,
                products: products,
                searchOptions: req.query,
                user: req.user,
                views: page_views,
                login: "1"
            });
        }
    }catch (e) {
        res.redirect("/");
    }
});

module.exports = router;