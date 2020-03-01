const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Seller = require("../../models/seller");
const Product = require("../../models/product");
const {isUser} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];

/*
 * GET Sellers Route
 */
router.get("/", async (req, res) => {
    const sellers = await Seller.find({}).populate("user").exec();
    const user = await User.findOne({username: req.user.username});
    const products = await Product.find({user: user});
    res.render("user/sellers/index", {
        sellers: sellers,
        products: products,
        login: "1"
    })
});

/*
 * GET New Seller Route
 */
router.get("/new", async (req, res) => {
    await renderNewSeller(req, res, new Seller());
});

/*
 * POST Create Product Route
 */
router.post("/", async (req, res) => {
    const seller = new Seller({
        user: req.body.user,
        gender: req.body.gender,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        seller: 2
    });
    savePortrait(seller, req.body.portrait);
    try {
        const newSeller = await seller.save();
        // res.redirect(`markets/sellers/${newSeller.id}`);
        res.redirect("/markets/sellers");
    }catch (e) {
        await renderNewSeller(req, res, seller, true);
    }
});

/*
 * GET Add Seller's Product Route
 */
router.get("/add", async (req, res) => {
    try {
        const sellerName = req.user;
        const seller = await User.findOne({username: sellerName.username});
        const product = Product.find({});
        res.render("user/sellers/add", {
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
router.post("/add", async (req, res) => {
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
        res.redirect(`/markets/sellers/${newProduct.id}`);
    }catch (e) {
        console.log(e);
        await renderNewSeller(res, product, true);
    }
});

/*
 * GET Seller's Page Route
 */
router.get("/:id", async (req, res) => {
    const seller = await Seller.findById(req.params.id).populate("user").exec();
    const products = await Product.find({seller: req.user});
    res.render("user/sellers/show", {
        login: "1",
        seller: seller,
        products: products
    })
});

async function renderNewSeller(req, res, seller, product, hasError = false) {
    try {
        const sellerName = req.user;
        const user = await User.findOne({username: sellerName.username});
        const params = {
            user: user,
            seller: seller,
            product: product,
            login: "1"
        };
        if (hasError) params.errorMessage = "Wrong";
        res.render("user/sellers/new", params);
    }catch (e) {
        console.log(e);
        res.redirect("/market/sellers")
    }
}

function savePortrait(seller, portraitEncoded) {
    if (portraitEncoded == null) return;
    const portrait = JSON.parse(portraitEncoded);
    if (portrait != null && imageMimeTypes.includes(portrait.type)) {
        seller.portraitImage = new Buffer.from(portrait.data, "base64");
        seller.portraitImageType = portrait.type;
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