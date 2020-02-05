const express = require("express");
const router = express.Router();
const Page = require("../../models/page");

/*
 * GET Pages Route
 */
router.get("/", async (req, res) => {
    try {
        const pages = await Page.find({});
        res.render("admin/pages/index", {pages: pages});
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET New Page Route
 */
router.get("/new", (req, res) => {
    res.render("admin/pages/new", {page: new Page()});
});

/*
 * POST Create Page Route
 */
router.post("/", async (req, res) => {
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
        res.render("admin/pages/new", {
            page: page,
            errorMessage: "Error Creating Page: fill all blanks"
        });
    }
});

module.exports = router;