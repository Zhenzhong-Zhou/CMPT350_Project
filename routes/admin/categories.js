const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET Categories Route
 */
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.category_name != null && req.query.category_name !== "") {
        searchOptions.categoryName = new RegExp(req.query.category_name, "i");
    }
    try {
        const categories = await Category.find(searchOptions);
        res.render("admin/categories/index", {
            categories: categories,
            searchOptions: req.query,
            login: "2"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET New Category Route
 */
router.get("/new", (req, res) => {
    res.render("admin/categories/new", {category: new Category(), login: "2"});
});

/*
 * POST Create Category Route
 */
router.post("/", [
    check("category_name").notEmpty().withMessage("Category name MUST have a value"),
    check("category_slug").notEmpty().withMessage("Category slug MUST have a value")
    ],
    async (req, res) => {
    const category = new Category({
        categoryName: req.body.category_name,
        slug: req.body.category_slug,
        login: "2"
    });
    try {
        const newCategory = await category.save();
        // res.redirect(`admin/pages/${newPage.id}`);
        res.redirect("categories");
    }catch (e) {
        const errorFormatter = ({location, msg, param}) => {
            return `${location}[${param}]: ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.render("admin/categories/new", {
                errorMessage: result.array()[0],
                errorMessage1: result.array()[1],
                errorMessage2: "",
                category: category,
                login: "2"
            });
        }
    }
});

module.exports = router;