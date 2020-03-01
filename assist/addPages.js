const Page = require("../models/page");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://bob:U6HxnPjpy2sYULjF@cluster0-hbynw.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const pages = [
    new Page({
        pageTitle: "Home",
        slug: "home1",
        content: "Computer science studies the theory, design, " +
            "\n development and application of software and " +
            "\n software systems in a wide range of fields from " +
            "\n artificial intelligence and human-computer " +
            "\n interaction to computational modelling and computer graphics.",
        sorting: 0
    }),
    new Page({
        pageTitle: "About us",
        slug: "about us",
        content: "You will learn about a wide range of topics including design " +
            "and maintenance of software systems, distributed systems, human-computer interaction, " +
            "computational modeling, artificial intelligence, mobile computing, programming languages, " +
            "image processing, and computer graphics. You will learn to combine creative problem solving" +
            " and analytical skills to create practical and innovative software.",
        sorting: 0
    }),
    new Page({
        pageTitle: "Services",
        slug: "services",
        content: "Our programs are designed to prepare graduates for careers across all sectors of " +
            "the information technology industry, as well as for graduate studies and research.",
        sorting: 0
    }),
    new Page({
        pageTitle: "Contact Us",
        slug: "contact us",
        content: "bob.zhou@usask.ca" +
            "https://github.com/Zhenzhong-Zhou/CMPT350_Project",
        sorting: 0
    })
];

let done = 0;
for (let i = 0; i < pages.length; i++) {
    pages[i].save((err, result) => {
        if (err) console.log(err);
        done++;
        if (done === pages.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}