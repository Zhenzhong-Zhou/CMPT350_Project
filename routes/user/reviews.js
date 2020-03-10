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
    const review = await Review.findById(req.params.id).populate("product").populate("user").exec();
    res.render("user/reviews/index", {
        review: review,
        login: "1"
    });
});

/*
 * GET Create Review Page Route
 */
router.get("/create-review/:product", isUser, async (req, res) => {
    const product = await Product.findOne({slug: req.params.product}).exec();
    res.render("user/reviews/new", {
        product: product,
        login: "1"
    });
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