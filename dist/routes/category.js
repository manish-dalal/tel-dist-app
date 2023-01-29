"use strict";

const express = require("express");
const _ = require("lodash");
const config = require("../config");
const {
  Logger
} = require("../utils/winston");
const {
  categories
} = require("../utils/categories");
const router = express.Router();
router.get("/list", async (req, res) => {
  try {
    res.json({
      error: false,
      categories,
      isMainBot: JSON.parse(_.get(config, "ISFULLBOT", "false"))
    });
  } catch (e) {
    Logger.error(e.message || "categories error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
module.exports = router;