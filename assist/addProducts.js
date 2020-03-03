if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const Category = require("../models/category");
const Product = require("../models/product");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const clothing = new Category({
        categoryName: "Clothing",
        slug: "clothing"
});

const products = [
    new Product({
        productName: "Test",
        category: clothing,
        author: "Bob",
        slug: "test",
        price: 11,
        publishDate: "2020-01-20",
        pageCount: 22,
        description: "Test",
        coverImageType: "image/jpeg",
        coverImage: "Binary('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAgICAsICAsQCwkLEBMOCwsOExYSEhMSEhYVERMSEhMRFRUZGhsaGRUhISQkISEw...', 0)"
    }),
];

let done = 0;
for (let i = 0; i < products.length; i++) {
    products[i].save((err, result) => {
        if (err) console.log(err);
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}