const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Seller = require("../../models/seller");
const Product = require("../../models/product");
const {isUser} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];

/*
 * GET Seller's Product Index Route
 */
router.get("/", async (req, res) => {
    const user = await User.findOne({username: req.user.username});
    const products = await Product.find({user: user});
    res.render("/user/products_sellers", {
        products: products,
        login: "1"
    });
});

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
        user: req.body.user,
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
        const newProduct = await product.save();
        res.redirect(`/markets/sellers/products/${newProduct.id}`);
    }catch (e) {
        console.log(e);
        await renderNewProduct(res, product, true);
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
        res.redirect("/market/sellers/products")
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