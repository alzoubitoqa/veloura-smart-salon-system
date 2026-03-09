const express = require("express");
const router = express.Router();
const { getSmartAnalysis } = require("../controllers/aiController");

router.get("/analysis", getSmartAnalysis);

module.exports = router;