const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Seller = require("../../models/seller");
const {isUser} = require("../../config/auth");
const path = require("path");
const uploadPath = path.join("public", Seller.portraitBasePath);
const multer = require("multer");
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "images/gif"];
const upload = multer({
   dest: uploadPath,
    fileFilter: (req, file, callback) => {
       callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

/*
 * GET Sellers Route
 */
router.get("/", async (req, res) => {
    const sellers = await Seller.find({}).populate("user").exec();
    res.render("user/markets/index", {
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
router.post("/", upload.single("portrait"), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const seller = new Seller({
        user: req.body.user,
        gender: req.body.gender,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        portrait: fileName,
        seller: 2
    });
    try {
        const newSeller = await seller.save();
        // res.redirect(`markets/sellers/${newSeller.id}`);
        res.redirect("/markets/sellers");
    }catch (e) {
        console.log(e);
        await renderNewSeller(req, res, seller, true);
    }
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
        res.render("user/markets/new", params);
    }catch (e) {
        console.log(e);
        res.redirect("/market/sellers")
    }
}

module.exports = router;