const mongoose = require("mongoose");
const Product = require("./product");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

categorySchema.pre("remove", function (next) {
    Product.find({category: this.id}, (err, products) => {
        if (err) {
            next()
        }else if (products.length > 0) {
            next(new Error("This category has products still."));
        }else {
            next()
        }
    });
});

module.exports = mongoose.model("Category", categorySchema);