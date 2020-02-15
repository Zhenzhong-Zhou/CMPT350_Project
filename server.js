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
const sellerRouter = require("./routes/user/sellers");
const registerSignUpRouter = require("./routes/register/sign_up");
const registerLoginRouter = require("./routes/register/login");
const registerLogoutRouter = require("./routes/register/logout");
const adminIndexRouter = require("./routes/admin/index");
const adminPageRouter = require("./routes/admin/pages");
const adminCategoryRouter = require("./routes/admin/categories");
const adminProductRouter = require("./routes/admin/products");

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
//
// const Product = require("./models/product");
// Product.find((err, products) => {
//     if (err) {
//         console.log(err);
//     }else {
//         app.locals.products = products;
//     }
// });

app.use("/", indexRouter);
app.use("/categories/products", productRouter);
app.use("/markets/sellers", sellerRouter);
app.use("/user/login", registerLoginRouter);
app.use("/user/logout", registerLogoutRouter);
app.use("/user/sign_up", registerSignUpRouter);
app.use("/admin/dashboard", adminIndexRouter);
app.use("/admin/pages", adminPageRouter);
app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/products", adminProductRouter);

// The Last Middleware: 404 Page
app.use((req, res, next) => {
    res.render("404", {login: "4"});
    next();
});

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
    console.log("Connected to Server on port " + app.get("port"));
});