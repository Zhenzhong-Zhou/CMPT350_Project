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
    if (req.session.cart && req.session.cart.length === 0) {
        delete req.session.cart;
        res.redirect("/cart/checkout")
    }else {
        res.render("user/products/checkout", {
            title: "Checkout",
            cart: req.session.cart,
            login: "1"
        });
    }
});

/*
 * GET update products
 */
router.get("/update/:product", (req, res) => {
    let productSlug = req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;
    for (let i = 0; i < cart.length; i ++) {
        if (cart[i].title === productSlug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length === 0) delete req.session.cart;
                    break;
                default:
                    console.log("update problem");
                    break;
            }
        }
        req.flash("Cart updated");
        res.redirect("/cart/checkout");
    }
});

module.exports = router;