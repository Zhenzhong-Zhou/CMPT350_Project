const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Category = require("../../models/category");
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");
const uploadPath = path.join("public", Product.coverImageBasePath);
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

const { check, validationResult } = require('express-validator');

/*
 * GET Products Route
 */
router.get("/", isAdmin, async (req, res) => {
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
router.get("/new", isAdmin, async (req, res) => {
    await renderNewPage(res, new Product())
});

/*
 * POST Create Product Route
 */
router.post("/", upload.single("cover"), async (req, res, next) => {
    const fileName = req.file != null ? req.file.filename : null;
    const product = new Product({
        productName: req.body.product_name,
        category: req.body.category,
        slug: req.body.product_slug,
        author: req.body.author,
        price: req.body.product_price,
        publishDate: new Date(req.body.product_publishDate),
        pageCount: req.body.product_pageCount,
        coverImageName: fileName,
        description: req.body.product_description
    });
    try {
        const newProduct = await product.save();
        // res.redirect(`admin/products/${newProducts.id}`);
        res.redirect("products");
    }catch (e) {
        if (product.coverImageName != null) {
            await removeProductCover(product.coverImageName);
        }
        await renderNewPage(res, product, true);
    }
});

function removeProductCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    });
}

async function renderNewPage(res, product, hasError = false) {
    try{
        const categories = await Category.find({});
        const params = {
            categories: categories,
            product: product,
            login: "2"
        };
        if (hasError) params.errorMessage = "Error Creating Product";
        if (hasError) params.errorMessage1 = "";
        if (hasError) params.errorMessage2 = "";
        res.render("admin/products/new", params)
    }catch (e) {
        res.redirect("/");
    }
}

module.exports = router;