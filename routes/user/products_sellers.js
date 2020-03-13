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
        const sellerName = req.user;
        const seller = await User.findOne({username: sellerName.username});
        const product = Product.find({});
        const products = await query.exec();
        res.render("user/products_sellers/new", {
            product: product,
            seller: seller,
            products: products,
            searchOptions: req.query,
            login: "1",
        });
    }catch (e) {
        res.redirect("/");
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
        await renderNewProduct(res, product, true);
    }
});

/*
 * GET Show Seller's Product Route
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
    try{
        const product = await Product.findById(req.params.id).populate("category").exec();
        const products = await query.exec();
        res.render("user/products_sellers/show", {
            product: product,
            products: products,
            searchOptions: req.query,
            login: "1"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Seller's Product Index Route
 */
router.get("/:id/display", async (req, res) => {
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
        const display_products = await Product.find({seller: req.params.id}).populate("seller").exec();
        const product = await Product.findOne({seller: req.params.id}).populate("seller").exec();
        const products = await query.exec();
        res.render("user/products_sellers/index", {
            display_products: display_products,
            products: products,
            searchOptions: req.query,
            product: product,
            login: "1",
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Edit Seller's Product Route
 */
router.get("/:id/edit", async (req, res) => {
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
        const sellerName = req.user;
        const seller = await User.findOne({username: sellerName.username});
        const product = await Product.findById(req.params.id);
        const products = await query.exec();
        res.render("user/products_sellers/edit", {
            seller: seller,
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
 * PUT Seller's Product Route
 */
router.put("/:id", async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id);
        product.productName = req.body.product_name;
        product.category = req.body.category;
        product.author = req.body.author;
        product.slug = req.body.product_slug;
        product.price = req.body.product_price;
        product.publishDate = new Date(req.body.product_publishDate);
        product.pageCount = req.body.product_pageCount;
        product.description = req.body.product_description;
        if (req.body.cover != null && req.body.cover !== "") {
            saveCover(product, req.body.cover)
        }
        await product.save();
        res.redirect(`/markets/sellers/${req.body.user}`);
    }catch (e) {
        if (product != null) {
            await renderEditProductPage(res, product, true);
        }
        res.redirect("/");
    }
});

/*
 * DELETE Product Route
 */
router.delete("/:id", async (req, res) => {
    let product;
    try{
        product = await Product.findById(req.params.id);
        await product.remove();
        res.redirect(`/markets/sellers/${product.seller}`);
    }catch (e) {
        if (product != null) {
            res.render("user/products_sellers/show", {
                product: product,
                errorMessage: "Could not remove product",
                login: "1"
            });
        }else {
            res.redirect("/");
        }
    }
});

async function renderNewProduct(req, res, product, hasError = false) {
    await renderFormPage(res, product, "new", hasError);
}
async function renderEditProductPage(res, product, hasError = false) {
    await renderFormPage(res, product, "edit", hasError);
}

async function renderFormPage(req, res, product, form, hasError = false) {
    try{
        const sellerName = req.user;
        const user = await User.findOne({username: sellerName.username});
        const params = {
            user: user,
            product: product,
            login: "1"
        };
        if (hasError) {
            if (form === "edit") {
                params.errorMessage = "Error Editing Product";
            }else {
                params.errorMessage = "Error Creating Product";
            }
        }
        res.render(`user/products_sellers/${form}`, params);
    }catch (e) {
        res.redirect("/");
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