const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const {isUser} = require("../config/auth");

/*
 * GET user side page index
 */
router.get("/", async (req, res) => {
    const views = req.session.views++;
    await Page.findOne({slug: "home"}, (err, page) => {
        if (err) console.log(err);
        res.render("index", {
            title: page.pageTitle,
            content: page.content,
            user: req.user,
            views: views,
            login: "1"
        })
    });
});

/*
 * GET user side page content
 */
router.get("/:slug", (req, res) => {
    const views = req.session.views++;
    const slug = req.params.slug;
    Page.findOne({slug: slug}, (err, page) => {
        if (err) console.log(err);
        if (!page) {
            res.redirect("/");
        }else {
            res.render("index", {
                title: page.pageTitle,
                content: page.content,
                user: req.user,
                views: views,
                login: "1"
            })
        }
    });
});

module.exports = router;