const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("admin/index", {
        login: "2"
    })
});

module.exports = router;