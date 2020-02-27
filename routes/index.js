const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const {isUser} = require("../config/auth");

/*
 * GET user side page index
 */
router.get("/", async (req, res) => {
    const views = req.session.views++;
    res.redirect("/");
    // try {
    //     const page = await Page.findOne({slug: "home"}).exec();
    //     res.render("index", {
    //         title: page.pageTitle,
    //         content: page.content,
    //         user: req.user,
    //         views: views,
    //         login: "1"
    //     })
    // }catch (e) {
    //     console.log(e);
    //     res.redirect("/");
    // }
});

/*
 * GET user side page content
 */
router.get("/:slug", async (req, res) => {
    const views = req.session.views++;
    const slug = req.params.slug;
    try {
        const page = await Page.findOne({slug: slug}).exec();
        console.log(page);
        if (!page) {
            res.redirect("/");
        }else {
            res.render("index", {
                title: page.pageTitle,
                content: page.content,
                user: req.user,
                views: views,
                login: "1"
            });
        }
    }catch (e) {
        console.log(e);
        // res.redirect("/");
    }
});

module.exports = router;