const express = require("express");
const router = express.Router();
const { getAllInventoryItems, createInventoryItem } = require("../controllers/inventoryController");

router.get("/", getAllInventoryItems);
router.post("/", createInventoryItem);

module.exports = router;