const express = require("express");
const router = express.Router();
const Category = require("../../models/category");


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
            searchOptions: req.query
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET New Category Route
 */
router.get("/new", (req, res) => {
    res.render("admin/categories/new", {category: new Category()});
});

/*
 * POST Create Category Route
 */
router.post("/", async (req, res) => {
    const category = new Category({
        categoryName: req.body.category_name,
        slug: req.body.category_slug
    });
    try {
        const newCategory = await category.save();
        // res.redirect(`admin/pages/${newPage.id}`);
        res.redirect("categories");
    }catch (e) {
        res.render("admin/categories/new", {
            category: category,
            errorMessage: "Error Creating Category: fill all blanks"
        });
    }
});

module.exports = router;