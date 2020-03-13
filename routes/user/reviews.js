const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Review = require("../../models/review");
const Reply = require("../../models/reply");
const {isUser} = require("../../config/auth");

/*
 * GET Products' Reviews Page Index Route
 */
router.get("/:id", isUser, async (req, res) => {
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
        const review = await Review.findById(req.params.id).populate("product").populate("user").exec();
        const products = await query.exec();
        res.render("user/reviews/index", {
            review: review,
            products: products,
            searchOptions: req.query,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Create Review Page Route
 */
router.get("/create-review/:product", isUser, async (req, res) => {
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
        const product = await Product.findOne({slug: req.params.product}).exec();
        const products = await query.exec();
        res.render("user/reviews/new", {
            product: product,
            products: products,
            searchOptions: req.query,
            login: "1"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * POST Create Review Route
 */
router.post("/", async (req, res) => {
    const review = new Review({
        subject: req.body.subject,
        review: req.body.review,
        product: req.body.product,
        user: req.body.user
    });
    try {
        const newReview = await review.save();
        res.redirect(`/products/users/reviews/${newReview.id}`)
    }catch (e) {
        console.log(e)
    }
});

/*
 * POST Reply Review Route
 */
router.post("/:id", async (req, res) => {
    const reply = new Reply({
        reply: req.body.reply,
        review: req.body.review
    });
    try {
        await reply.save();
        res.redirect(`/categories/products`)
    }catch (e) {
        console.log(e)
    }
});

module.exports = router;