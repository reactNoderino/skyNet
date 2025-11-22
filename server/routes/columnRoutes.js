const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const { updateColumn, deleteColumn } = require("../controllers/columnController");
const { getCards, createCard } = require("../controllers/cardController");

const router = express.Router();

// GET and CREATE Cards by column
router.get("/:columnId/cards", authenticateToken, getCards);
router.post("/:columnId/cards", authenticateToken, createCard);

// UPDATE and DELETE
router.put("/:columnId", authenticateToken, updateColumn);
router.delete("/:columnId", authenticateToken, deleteColumn);

module.exports = router;
