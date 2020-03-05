const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Product = require("../../models/product");
const {isUser} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];

/*
 * GET Add Seller's Product Route
 */
router.get("/new", async (req, res) => {
    try {
        const sellerName = req.user;
        const seller = await User.findOne({username: sellerName.username});
        const product = Product.find({});
        res.render("user/products_sellers/new", {
            product: product,
            seller: seller,
            login: "1",
        });
    }catch (e) {
        console.log(e);
    }
});

/*
 * POST Create Seller's Product Route
 */
router.post("/", async (req, res) => {
    const product = new Product({
        seller: req.body.user,
        productName: req.body.product_name,
        category: req.body.category,
        slug: req.body.product_slug,
        author: req.body.author,
        price: req.body.product_price,
        publishDate: new Date(req.body.product_publishDate),
        pageCount: req.body.product_pageCount,
        description: req.body.product_description
    });
    saveCover(product, req.body.cover);
    try {
        await product.save();
        res.redirect(`/markets/sellers/${req.body.user}`);
    }catch (e) {
        console.log(e);
        await renderNewProduct(res, product, true);
    }
});

/*
 * GET Show Seller's Product Route
 */
router.get("/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate("category").exec();
        res.render("user/products_sellers/show", {
            product: product,
            login: "1"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Edit Seller's Product Route
 */
router.get("/:id/edit", async (req, res) => {
    try {
        const sellerName = req.user;
        const seller = await User.findOne({username: sellerName.username});
        const product = await Product.findById(req.params.id);
        res.render("user/products_sellers/edit", {
            seller: seller,
            product: product,
            login: "1"
        });
        // await renderEditProduct(res, product);
    }catch (e) {
        res.redirect("/");
    }
});

async function renderNewProduct(req, res, product, hasError = false) {
    try {
        const sellerName = req.user;
        const user = await User.findOne({username: sellerName.username});
        const params = {
            user: user,
            product: product,
            login: "1"
        };
        if (hasError) params.errorMessage = "Wrong";
        res.render("user/products_sellers/new", params);
    }catch (e) {
        console.log(e);
        res.redirect("")
    }
}

function saveCover(product, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        product.coverImage = new Buffer.from(cover.data, "base64");
        product.coverImageType = cover.type;
    }
}

module.exports = router;