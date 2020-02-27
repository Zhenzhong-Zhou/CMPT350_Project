const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const {isUser} = require("../../config/auth");

/*
 * GET add product to cart
 */
router.get("/add/:product", (req, res) => {
    const productSlug = req.params.product;
    Product.findOne({slug: req.params.product}, (err, product) => {
        if (err) console.log(err);
        if (typeof req.session.cart === "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: productSlug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: product.coverImagePath
            });
        }else {
            let cart = req.session.cart;
            let newItem = true;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title === productSlug) {
                    cart[i].qty ++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: productSlug,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: product.coverImagePath
                });
            }
        }
        req.flash("Product added");
        res.redirect("back");
    });
});

/*
 * GET checkout page
 */
router.get("/checkout", (req, res) => {
    res.render("user/products/checkout", {
        title: "Checkout",
        cart: req.session.cart,
        login: "1"
    })
});

module.exports = router;