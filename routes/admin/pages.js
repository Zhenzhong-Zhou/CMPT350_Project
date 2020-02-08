const express = require("express");
const router = express.Router();
const Page = require("../../models/page");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET Pages Route
 */
router.get("/", isAdmin, async (req, res) => {
    let searchOptions = {};
    if (req.query.page_title != null && req.query.page_title !== "") {
        searchOptions.pageTitle = new RegExp(req.query.page_title, "i");
    }
    try {
        const pages = await Page.find(searchOptions);
        res.render("admin/pages/index", {
            pages: pages,
            searchOptions: req.query,
            login: "2"
        });
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET New Page Route
 */
router.get("/new", isAdmin, (req, res) => {
    res.render("admin/pages/new", {page: new Page(), login: "2"});
});

/*
 * POST Create Page Route
 */
router.post("/", [
    check("page_title").notEmpty().withMessage("Page Title MUST have a value"),
    check("page_slug").notEmpty().withMessage("Page slug MUST have a value"),
    check("page_content").notEmpty().withMessage("Page content MUST have a value")
    ],
    async (req, res) => {
    const page = new Page({
        pageTitle: req.body.page_title,
        slug: req.body.page_slug,
        content: req.body.page_content,
        sorting: 0
    });
    try {
        const newPage = await page.save();
        // res.redirect(`admin/pages/${newPage.id}`);
        res.redirect("pages");
    }catch (e) {
        const errorFormatter = ({location, msg, param}) => {
            return `${location}[${param}]: ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.render("admin/pages/new", {
                errorMessage: result.array()[0],
                errorMessage1: result.array()[1],
                errorMessage2: result.array()[2],
                page: page,
                login: "2"
            });
        }
    }
});

/*
 *  POST reorder pages
 */
router.post("/reorder", async (req) => {
    let ids = req.body['id[]'];
    let count = 0;
    console.log(ids);
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;
        (function (count) {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save(err => {
                    if (err) return console.log(err);
                });
            });
        })(count);
    }
});

module.exports = router;