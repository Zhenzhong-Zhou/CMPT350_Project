const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const { check, validationResult } = require('express-validator');

/*
 * GET Products Route
 */
router.get("/", async (req, res) => {

});

/*
 * GET New Product Route
 */
router.get("/new", (req, res) => {

});

/*
 * POST Create Product Route
 */
router.post("/", async (req, res) => {
});

module.exports = router;