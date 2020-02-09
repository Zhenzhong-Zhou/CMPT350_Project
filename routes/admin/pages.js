const express = require("express");
const router = express.Router();
const Page = require("../../models/page");
const {isAdmin} = require("../../config/auth");
const { check, validationResult } = require('express-validator');

/*
 * GET Pages Route
 */
router.get("/", async (req, res) => {
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
router.get("/new", (req, res) => {
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
        res.redirect(`/admin/pages/${newPage.id}`);
    }catch (e) {
        const errorFormatter = ({msg}) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            return res.render("admin/pages/new", {
                errorMessage: result.array(),
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

/*
 * GET Show Page Route
 */
router.get("/:id", async (req, res) => {
    try{
        let page = await Page.findById(req.params.id).limit(10).exec();
        res.render("admin/pages/show", {
            page: page,
            login: "2"
        })
    }catch (e) {
        res.redirect("/")
    }
});

/*
 * GET Edit Page Route
 */
router.get("/:id/edit", async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        res.render("admin/pages/edit", {page: page, login: "2"});
    }catch (e) {
        res.redirect("/admin/pages");
    }
});

/*
 * PUT Category Route
 */
router.put("/:id", [
        check("page_title").notEmpty().withMessage("Page Title MUST have a value"),
        check("page_slug").notEmpty().withMessage("Page slug MUST have a value"),
        check("page_content").notEmpty().withMessage("Page content MUST have a value")
    ],
    async (req, res) => {
        let page;
        try {
            page = await Page.findById(req.params.id);
            page.pageTitle = req.body.page_title;
            page.slug = req.body.page_slug;
            page.content = req.body.page_content;
            await page.save();
            res.redirect(`/admin/pages/${page.id}`);
        }catch (e) {
            if (page == null) {
                res.redirect("/")
            }else {
                const errorFormatter = ({msg}) => {
                    return `${msg}`;
                };
                const result = validationResult(req).formatWith(errorFormatter);
                if (!result.isEmpty()) {
                    return res.render("admin/pages/new", {
                        errorMessage: result.array(),
                        page: page,
                        login: "2"
                    });
                }
            }
        }
    });

/*
 * DELETE Show Page Route
 */
router.delete("/:id", async (req, res) => {
    let page;
    try {
        page = await Page.findById(req.params.id);
        await page.remove();
        res.redirect("/admin/pages");
    }catch (e) {
        if (page == null) {
            res.redirect("/");
        }else {
            res.redirect(`/admin/pages/${page.id}`);
        }
    }
});

module.exports = router;