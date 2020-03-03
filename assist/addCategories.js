if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const Category = require("../models/category");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const categories = [
    new Category({
        categoryName: "Clothing",
        slug: "clothing"
    }),
    new Category({
        categoryName: "Beauty",
        slug: "beauty"
    }),
    new Category({
        categoryName: "Beauty",
        slug: "beauty"
    }),
    new Category({
        categoryName: "Watches",
        slug: "watches"
    }),
    new Category({
        categoryName: "Mobiles",
        slug: "mobiles"
    }),
    new Category({
        categoryName: "Baby",
        slug: "baby"
    }),
    new Category({
        categoryName: "Drinks",
        slug: "drinks"
    }),
    new Category({
        categoryName: "Fruits",
        slug: "fruits"
    }),
    new Category({
        categoryName: "Books",
        slug: "books"
    }),
    new Category({
        categoryName: "Home & Kitchen",
        slug: "home & kitchen"
    })
];

let done = 0;
for (let i = 0; i < categories.length; i++) {
    categories[i].save((err, result) => {
        if (err) console.log(err);
        done++;
        if (done === categories.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}