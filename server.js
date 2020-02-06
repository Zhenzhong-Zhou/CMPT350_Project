if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const registerIndexRouter = require("./routes/register/index");
const registerLoginRouter = require("./routes/register/login");
const registerSignUpRouter = require("./routes/register/sign_up");
const adminIndexRouter = require("./routes/admin/index");
const adminPageRouter = require("./routes/admin/pages");
const adminCategoryRouter = require("./routes/admin/categories");
const adminProductRouter = require("./routes/admin/products");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.set(express.static("public"));
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose......"));

app.use("/", indexRouter);
app.use("/index", registerIndexRouter);
app.use("/login", registerLoginRouter);
app.use("/sign_up", registerSignUpRouter);
app.use("/admin/dashboard", adminIndexRouter);
app.use("/admin/pages", adminPageRouter);
app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/products", adminProductRouter);

// The Last Middleware: 404 Page
app.use((req, res, next) => {
    res.render("404", {login: "4"});
    next();
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Connected to Server......")
});