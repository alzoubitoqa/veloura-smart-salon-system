const express = require("express");
const router = express.Router();
const { getAllStaff, createStaff } = require("../controllers/staffController");

router.get("/", getAllStaff);
router.post("/", createStaff);

module.exports = router;