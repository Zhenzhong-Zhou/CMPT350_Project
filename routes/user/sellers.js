const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Seller = require("../../models/seller");
const {isUser} = require("../../config/auth");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];

/*
 * GET Sellers Route
 */
router.get("/", async (req, res) => {
    const sellers = await Seller.find({}).populate("user").exec();
    res.render("user/sellers/index", {
        sellers: sellers,
        login: "1"
    })
});

/*
 * GET New Seller Route
 */
router.get("/new", async (req, res) => {
    await renderNewSeller(req, res, new Seller());
});

/*
 * POST Create Product Route
 */
router.post("/", async (req, res) => {
    const seller = new Seller({
        user: req.body.user,
        gender: req.body.gender,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        seller: 2
    });
    savePortrait(seller, req.body.portrait);
    try {
        const newSeller = await seller.save();
        // res.redirect(`markets/sellers/${newSeller.id}`);
        res.redirect("/markets/sellers");
    }catch (e) {
        await renderNewSeller(req, res, seller, true);
    }
});

/*
 * GET Seller's Page Route
 */
router.get("/:id", async (req, res) => {
    const seller = await Seller.findById(req.params.id).populate("user").exec();
    res.render("user/sellers/show", {
        login: "1",
        seller: seller
    })
});

async function renderNewSeller(req, res, seller, hasError = false) {
    try {
        const sellerName = req.user;
        const user = await User.findOne({username: sellerName.username});
        const params = {
            user: user,
            seller: seller,
            login: "1"
        };
        if (hasError) params.errorMessage = "Wrong";
        res.render("user/sellers/new", params);
    }catch (e) {
        console.log(e);
        res.redirect("/market/sellers")
    }
}

function savePortrait(seller, portraitEncoded) {
    if (portraitEncoded == null) return;
    const portrait = JSON.parse(portraitEncoded);
    if (portrait != null && imageMimeTypes.includes(portrait.type)) {
        seller.portraitImage = new Buffer.from(portrait.data, "base64");
        seller.portraitImageType = portrait.type;
    }
}

module.exports = router;