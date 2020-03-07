const express = require("express");
const router = express.Router();
const Page = require("../../models/page");
const Product = require("../../models/product");
const Review = require("../../models/review");
const {isUser} = require("../../config/auth");

/*
 * GET Products' Reviews Page Index Route
 */
router.get("/", async (req, res) => {
    const reviews = await Review.find({}).populate("user").exec();
    res.render("user/reviews/index", {
        reviews: reviews,
        login: "1"
    });
});

/*
 * GET Create Review Page Route
 */
router.get("/create-review/:product", async (req, res) => {
    const product = await Product.findOne({slug: req.params.product}).exec();
    console.log(product);
    console.log(req.body.product);
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
        await review.save();
        res.redirect("/products/users/reviews")
    }catch (e) {
        console.log(e)
    }
});

module.exports = router;