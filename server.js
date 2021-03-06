if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose......"));

const indexRouter = require("./routes/index");
const productRouter = require("./routes/user/products");
const productReviewRouter = require("./routes/user/reviews");
const cartRouter = require("./routes/user/cart");
const sellerRouter = require("./routes/user/sellers");
const sellerProductRouter = require("./routes/user/products_sellers");
const userProfileRouter = require("./routes/user/profiles");
const registerSignUpRouter = require("./routes/register/sign_up");
const registerSellerSignUpRouter = require("./routes/register/seller_sign_up");
const registerLoginRouter = require("./routes/register/login");
const registerLogoutRouter = require("./routes/register/logout");
const registerResetRouter = require("./routes/register/reset");
const adminIndexRouter = require("./routes/admin/index");
const adminPageRouter = require("./routes/admin/pages");
const adminCategoryRouter = require("./routes/admin/categories");
const adminProductRouter = require("./routes/admin/products");
const adminSellerRouter = require("./routes/admin/sellers");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use("/public", express.static("public"));
app.use(express.urlencoded({limit: "10mb", extended: false}));
app.use(express.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.cart = req.session.cart;
    next();
});

const Page = require("./models/page");
Page.find({}).sort({sorting: 1}).exec((err, pages) => {
    if (err) {
        console.log(err);
    }else {
        app.locals.pages = pages;
    }
});

const Category = require("./models/category");
Category.find((err, categories) => {
    if (err) {
        console.log(err);
    }else {
        app.locals.categories = categories;
    }
});

app.use("/", indexRouter);
app.use("/categories/products", productRouter);
app.use("/products/users/reviews", productReviewRouter);
app.use("/cart", cartRouter);
app.use("/markets/sellers", sellerRouter);
app.use("/markets/sellers/products", sellerProductRouter);
app.use("/user/profile", userProfileRouter);
app.use("/user/login", registerLoginRouter);
app.use("/user/logout", registerLogoutRouter);
app.use("/user/sign_up", registerSignUpRouter);
app.use("/user/reset", registerResetRouter);
app.use("/seller/sign_up", registerSellerSignUpRouter);
app.use("/admin/dashboard", adminIndexRouter);
app.use("/admin/pages", adminPageRouter);
app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/products", adminProductRouter);
app.use("/admin/sellers", adminSellerRouter);

const Product = require("./models/product");
// The Last Middleware: 404 Page
app.use(async (req, res, next) => {
    let query = Product.find({});
    let name = req.query.product_name;
    let author = req.query.author;
    if (name != null && name !== "") {
        query = query.regex("productName", new RegExp(name, "i"));
    }
    if (author!= null && author !== "") {
        query = query.regex("author", new RegExp(author, "i"));
    }
    const products = await query.exec();
    res.render("404", {
        products: products,
        searchOptions: req.query,
        login: "4"
    });
    next();
});

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
    console.log("Connected to Server on port " + app.get("port"));
});