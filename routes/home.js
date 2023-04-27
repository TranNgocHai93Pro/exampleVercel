const express = require("express");
const router = express.Router();
const db = require("./db")
router.get("/", async (req, res, next) => {
  return res.status(200).json(db);
});

module.exports = router;
