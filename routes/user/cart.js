const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const {isUser} = require("../../config/auth");

/*
 * GET add product to cart
 */
router.get("/add/:product", isUser, (req, res) => {
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
router.get("/checkout", isUser, async (req, res) => {
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    try {
        if (req.session.cart && req.session.cart.length === 0) {
            delete req.session.cart;
            res.redirect("/cart/checkout")
        }else {
            const products = await query.exec();
            res.render("user/products/checkout", {
                title: "Checkout",
                cart: req.session.cart,
                products: products,
                searchOptions: req.query,
                login: "1"
            });
        }
    }catch (e) {
        res.redirect("/");
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

/*
 * GET clear cart
 */
router.get("/clear", (req, res) => {
    delete req.session.cart;
    res.redirect("/cart/checkout");
});

module.exports = router;