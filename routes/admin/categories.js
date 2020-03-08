const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const Product = require("../../models/product");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET Categories Route
 */
router.get("/", isAdmin, async (req, res) => {
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
        Category.find((err, categories) => {
            if (err) {
                console.log(err);
            }else {
                req.app.locals.categories = categories;
            }
        });
        res.redirect(`/admin/categories/${newCategory.id}`);
    }catch (e) {
        const errorFormatter = ({msg}) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.render("admin/categories/new", {
                errorMessage: result.array(),
                category: category,
                login: "2"
            });
        }
    }
});

/*
 * GET Show Category Route
 */
router.get("/:id", async (req, res) => {
    try{
        let category = await Category.findById(req.params.id);
        let products = await Product.find({category: category.id}).limit(10).exec();
        res.render("admin/categories/show", {
            category: category,
            productsByCategory: products,
            login: "2"
        });
    }catch (e) {
        res.redirect("/")
    }
});

/*
 * GET Edit Category Route
 */
router.get("/:id/edit", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render("admin/categories/edit", {category: category, login: "2"});
    }catch (e) {
        res.redirect("/admin/categories");
    }
});

/*
 * PUT Category Route
 */
router.put("/:id", [
        check("category_name").notEmpty().withMessage("Category name MUST have a value"),
        check("category_slug").notEmpty().withMessage("Category slug MUST have a value")
    ],
    async (req, res) => {
        let category;
        try {
            category = await Category.findById(req.params.id);
            category.categoryName = req.body.category_name;
            category.slug = req.body.category_slug;
            await category.save();
            Category.find((err, categories) => {
                if (err) {
                    console.log(err);
                }else {
                    req.app.locals.categories = categories;
                }
            });
            res.redirect(`/admin/categories/${category.id}`);
        }catch (e) {
            if (category == null) {
                res.redirect("/")
            }else {
                const errorFormatter = ({msg}) => {
                    return `${msg}`;
                };
                const result = validationResult(req).formatWith(errorFormatter);
                if (!result.isEmpty()) {
                    return res.render("admin/categories/edit", {
                        errorMessage: result.array(),
                        category: category,
                        login: "2"
                    });
                }
            }
        }
    });


/*
 * DELETE Show Category Route
 */
router.delete("/:id", async (req, res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        await category.remove();
        Category.find((err, categories) => {
            if (err) {
                console.log(err);
            }else {
                req.app.locals.categories = categories;
            }
        });
        res.redirect("/admin/categories");
    }catch (e) {
        if (category == null) {
            res.redirect("/");
        }else {
            res.redirect(`/admin/categories/${category.id}`);
        }
    }
});

module.exports = router;