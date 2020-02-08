const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require('../../config/auth');

router.get("/", checkAuthenticated, (req, res) => {
    res.render("register/index", {login : "1"})
});

router.post("/", (req, res) => {


});

module.exports = router;