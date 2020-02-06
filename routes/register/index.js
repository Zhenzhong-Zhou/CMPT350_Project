const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("register/index", {login : "1"})
});

router.post("/", (req, res) => {


});

module.exports = router;