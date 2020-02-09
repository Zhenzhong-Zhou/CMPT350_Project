const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];
const { check, validationResult } = require('express-validator');

/*
 * GET Products Route
 */
router.get("/", async (req, res) => {
    let query = Product.find();
    if (req.query.product_name != null && req.query.product_name !== "") {
        query = query.regex("productName", new RegExp(req.query.product_name, "i"));
    }
    if (req.query.author != null && req.query.author !== "") {
        query = query.regex("author", new RegExp(req.query.author, "i"));
    }
    if (req.query.product_publishBefore != null && req.query.product_publishBefore !== "") {
       query = query.lte("publishDate", req.query.product_publishBefore)
    }
    if (req.query.product_publishAfter != null && req.query.product_publishAfter !== "") {
        query = query.gte("publishDate", req.query.product_publishAfter)
    }
    try {
        const products = await query.exec();
        res.render("admin/products/index", {
            products: products,
            searchOptions: req.query,
            login: "2"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET New Product Route
 */
router.get("/new", async (req, res) => {
    await renderNewPage(res, new Product());
});

/*
 * POST Create Product Route
 */
router.post("/", async (req, res, next) => {
    const product = new Product({
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
        res.redirect(`/admin/products/${newProduct.id}`);
    }catch (e) {
        await renderNewPage(res, product, true);
    }
});

/*
 * GET List of Products Route
 */
router.get("/list", async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("admin/products/list", {
            products: products,
            login: "2"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Show Product Route
 */
router.get("/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate("category").exec();
        res.render("admin/products/show", {
            product: product,
            login: "2"
        })
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET Edit Product Route
 */
router.get("/:id/edit", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        await renderEditPage(res, product);
    }catch (e) {
     res.redirect("/");
    }
});

/*
 * PUT Product Route
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
        res.redirect(`/admin/products/${product.id}`);
    }catch (e) {
        console.log(e);
        if (product != null) {
            await renderEditPage(res, product, true);
        }
        res.redirect("/");
    }
});

/*
 * DELETE Show Product Route
 */
router.delete("/:id", async (req, res) => {
    let product;
    try{
        product = await Product.findById(req.params.id);
        await product.remove();
        res.redirect("/admin/products");
    }catch (e) {
        console.log(e);
        if (product != null) {
            res.render("admin/products/show", {
                product: product,
                errorMessage: "Could not remove product",
                login: "2"
            });
        }else {
            res.redirect("/");
        }
    }
});

async function renderNewPage(res, product, hasError = false) {
    await renderFormPage(res, product, "new", hasError)
}

async function renderEditPage(res, product, hasError = false) {
    await renderFormPage(res, product, "edit", hasError)
}

async function renderFormPage(res, product, form, hasError = false) {
    try{
        const categories = await Category.find({});
        const params = {
            categories: categories,
            product: product,
            login: "2"
        };
        if (hasError) {
            if (form === "edit") {
                params.errorMessage = "Error Editing Product";
            }else {
                params.errorMessage = "Error Creating Product";
            }
        }
        res.render(`admin/products/${form}`, params)
    }catch (e) {
        res.redirect("/");
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
}

module.exports = router;