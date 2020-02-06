const express = require("express");
const router = express.Router();
const User = require("../../models/user");

router.get("/", (req, res) => {
    res.render("register/sign_up", {login: "3"})
});

router.post("/", async (req, res) => {
});

module.exports = router;